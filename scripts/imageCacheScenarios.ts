import { fetchPokemonImage } from '../src/utils/imageCache'
import { PLACEHOLDER_IMAGE_PATH } from '../src/constants/pokemon'

declare const process: { exitCode?: number }
declare const Buffer: {
  from(input: ArrayBuffer): { toString(encoding: string): string }
}

type FetchScenario = 'success' | 'api-error' | 'sprite-error'

interface TestResult {
  id: string
  description: string
  success: boolean
  details?: string
}

class MockLocalStorage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }
}

class MockFileReader {
  static readonly EMPTY = 0
  static readonly LOADING = 1
  static readonly DONE = 2

  result: string | ArrayBuffer | null = null
  onloadend: (() => void) | null = null
  onerror: (() => void) | null = null
  readyState: number = MockFileReader.EMPTY

  readAsDataURL(blob: Blob): void {
    this.readyState = MockFileReader.LOADING
    blob
      .arrayBuffer()
      .then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64')
        this.result = `data:${blob.type};base64,${base64}`
        this.readyState = MockFileReader.DONE
        this.onloadend?.()
      })
      .catch(() => {
        this.result = null
        this.readyState = MockFileReader.DONE
        this.onerror?.()
      })
  }
}

const localStorage = new MockLocalStorage()

const timerMap = new Map<number, ReturnType<typeof setTimeout>>()
let timerIdCounter = 0

function windowSetTimeout(callback: () => void, delay: number): number {
  timerIdCounter += 1
  const timeoutId = timerIdCounter
  const handle = setTimeout(callback, delay)
  timerMap.set(timeoutId, handle)
  return timeoutId
}

function windowClearTimeout(timeoutId: number): void {
  const handle = timerMap.get(timeoutId)
  if (handle) {
    clearTimeout(handle)
    timerMap.delete(timeoutId)
  }
}

const windowLike = {
  localStorage,
  setTimeout: windowSetTimeout,
  clearTimeout: windowClearTimeout,
}

interface GlobalWithWindow {
  window: typeof windowLike
  FileReader: typeof MockFileReader
  fetch: (input: unknown, init?: unknown) => Promise<Response>
}

;(globalThis as unknown as GlobalWithWindow).window = windowLike
;(globalThis as unknown as GlobalWithWindow).FileReader = MockFileReader

let activeScenario: FetchScenario = 'success'
const spriteUrl = 'https://example.com/pikachu.png'
const fetchLog: string[] = []

const mockFetch = async (input: unknown, init?: unknown): Promise<Response> => {
  void init
  const url = typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.toString()
      : typeof input === 'object' && input !== null && 'url' in input
        ? String((input as { url: unknown }).url)
        : ''
  fetchLog.push(url)

  if (activeScenario === 'api-error') {
    throw new Error('PokeAPI request failed')
  }

  if (url.includes('pokeapi.co')) {
    return new Response(
      JSON.stringify({ sprites: { front_default: spriteUrl } }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  if (activeScenario === 'sprite-error') {
    throw new Error('Sprite fetch failed')
  }

  if (url === spriteUrl) {
    const blob = new Blob(['mock-image-data'], { type: 'image/png' })
    return new Response(blob, {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    })
  }

  throw new Error(`Unexpected fetch URL: ${url}`)
}

;(globalThis as unknown as GlobalWithWindow).fetch = mockFetch

const results: TestResult[] = []

async function run(id: string, description: string, execute: () => Promise<void> | void): Promise<void> {
  try {
    await execute()
    results.push({ id, description, success: true })
  } catch (error) {
    results.push({
      id,
      description,
      success: false,
      details: error instanceof Error ? error.message : String(error),
    })
  }
}

function expect(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

async function runTests() {
  await run('T037-1', '初回取得でlocalStorageにキャッシュを保存する', async () => {
    activeScenario = 'success'
    localStorage.clear()
    fetchLog.length = 0

    const result = await fetchPokemonImage(25)
    expect(result.startsWith('data:image/png;base64,'), 'Base64形式で画像が返されるべきです')
    expect(localStorage.getItem('pokemon-image-25') === result, 'キャッシュが保存されていません')
    expect(fetchLog.filter((url) => url.includes('pokeapi.co')).length === 1, 'PokeAPIが呼ばれていません')
    expect(fetchLog.filter((url) => url === spriteUrl).length === 1, 'スプライト画像が取得されていません')
  })

  await run('T037-2', 'キャッシュヒット時はfetchを呼び出さない', async () => {
    activeScenario = 'success'
    fetchLog.length = 0

    const cached = await fetchPokemonImage(25)
    expect(fetchLog.length === 0, 'キャッシュヒット時にfetchが呼ばれています')
    expect(cached === localStorage.getItem('pokemon-image-25'), 'キャッシュされた値と一致しません')
  })

  await run('T037-3', 'APIエラー時はプレースホルダーを返す', async () => {
    activeScenario = 'api-error'
    localStorage.clear()
    fetchLog.length = 0

    const result = await fetchPokemonImage(1)
    expect(result === PLACEHOLDER_IMAGE_PATH, 'エラー時はプレースホルダーを返すべきです')
    expect(localStorage.getItem('pokemon-image-1') === null, 'エラー時にキャッシュを保存すべきではありません')
  })

  await new Promise((resolve) => setTimeout(resolve, 0))

  const hasFailure = results.some((entry) => !entry.success)
  results.forEach((entry) => {
    if (entry.success) {
      console.log(`✅ ${entry.id} ${entry.description}`)
    } else {
      console.error(`❌ ${entry.id} ${entry.description}: ${entry.details}`)
    }
  })

  const summary = hasFailure ? '一部のテストが失敗しました' : 'すべてのテストが成功しました'
  console.log(`\n${summary}`)

  if (hasFailure) {
    process.exitCode = 1
  }
}

runTests().catch((error) => {
  console.error('シナリオ実行中に予期しないエラーが発生しました', error)
  process.exitCode = 1
})

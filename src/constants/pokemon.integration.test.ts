import { POKEMON_ID_MAP } from './pokemon'

declare const process: { exitCode: number | undefined }

const TIMEOUT_MS = 30_000
const POKE_API_BASE = 'https://pokeapi.co/api/v2/pokemon/'

const delay = (ms: number) =>
  new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error(`timeout after ${ms}ms`))
    }, ms)
  })

const fetchWithTimeout = async (url: string) => {
  try {
    const response = (await Promise.race([fetch(url), delay(TIMEOUT_MS)])) as Response
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw error
    }
    throw new Error(`Failed to fetch ${url}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const run = async () => {
  const missingKeys = Object.keys(POKEMON_ID_MAP).filter((key) => {
    const value = (POKEMON_ID_MAP as Record<string, number>)[key]
    return typeof value !== 'number'
  })

  if (missingKeys.length > 0) {
    throw new Error(`POKEMON_ID_MAP contains non-numeric entries: ${missingKeys.join(', ')}`)
  }

  for (const [pieceType, id] of Object.entries(POKEMON_ID_MAP)) {
    const url = `${POKE_API_BASE}${id}`
    console.log(`fetching ${pieceType} from ${url}`)
    const response = await fetchWithTimeout(url)
    const data = (await response.json()) as { sprites?: { front_default?: string } }
    if (!data.sprites?.front_default) {
      throw new Error(`${pieceType} is missing sprites.front_default in PokeAPI response`)
    }
  }

  console.log('ok - All PokeAPI entries returned images within timeout')
}

run().catch((error) => {
  console.error('not ok - pokemon integration test failed')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})

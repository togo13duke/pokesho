import { PLACEHOLDER_IMAGE_PATH, POKEMON_ID_MAP } from '../constants/pokemon'

const CACHE_KEY_PREFIX = 'pokemon-image-'
const CACHE_TIMEOUT_MS = 5000

function getCacheKey(pokemonId: number): string {
  return `${CACHE_KEY_PREFIX}${pokemonId}`
}

function readFromCache(pokemonId: number): string | null {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(getCacheKey(pokemonId))
  } catch (error) {
    console.warn('画像キャッシュの読み込みに失敗しました', error)
    return null
  }
}

function writeToCache(pokemonId: number, value: string): void {
  try {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(getCacheKey(pokemonId), value)
  } catch (error) {
    console.warn('画像キャッシュの保存に失敗しました', error)
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('画像のBase64変換に失敗しました'))
      }
    }
    reader.onerror = () => reject(new Error('画像のBase64変換に失敗しました'))
    reader.readAsDataURL(blob)
  })
}

async function fetchPokemonSpriteUrl(pokemonId: number, signal: AbortSignal): Promise<string> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, { signal })
  if (!response.ok) {
    throw new Error(`PokeAPIのレスポンスが不正です: ${response.status}`)
  }

  const data = await response.json()
  const spriteUrl: string | undefined = data?.sprites?.front_default
  if (!spriteUrl) {
    throw new Error('PokeAPIから画像URLを取得できませんでした')
  }

  return spriteUrl
}

async function downloadSprite(spriteUrl: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(spriteUrl, { signal })
  if (!response.ok) {
    throw new Error(`画像の取得に失敗しました: ${response.status}`)
  }

  const blob = await response.blob()
  return blobToBase64(blob)
}

export async function fetchPokemonImage(pokemonId: number): Promise<string> {
  if (typeof window === 'undefined') {
    return PLACEHOLDER_IMAGE_PATH
  }

  const cached = readFromCache(pokemonId)
  if (cached) {
    return cached
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), CACHE_TIMEOUT_MS)

  try {
    const spriteUrl = await fetchPokemonSpriteUrl(pokemonId, controller.signal)
    const base64Image = await downloadSprite(spriteUrl, controller.signal)
    writeToCache(pokemonId, base64Image)
    return base64Image
  } catch (error) {
    console.warn('PokeAPIからの画像取得に失敗しました', error)
    return PLACEHOLDER_IMAGE_PATH
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function fetchPokemonImageByPieceType(pieceType: keyof typeof POKEMON_ID_MAP): Promise<string> {
  const pokemonId = POKEMON_ID_MAP[pieceType]
  return fetchPokemonImage(pokemonId)
}

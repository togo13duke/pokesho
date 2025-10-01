import { POKEMON_ID_MAP } from './pokemon'

interface TestCase {
  name: string
  run: () => void
}

const runTests = (cases: TestCase[]) => {
  let hasFailure = false
  for (const testCase of cases) {
    try {
      testCase.run()
      console.log(`ok - ${testCase.name}`)
    } catch (error) {
      hasFailure = true
      console.error(`not ok - ${testCase.name}`)
      if (error instanceof Error) {
        console.error(error.message)
      } else {
        console.error(error)
      }
    }
  }
  if (hasFailure) {
    throw new Error('pokemon constants contract tests failed')
  }
}

const assertEqual = (actual: unknown, expected: unknown, message: string) => {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${String(expected)}, received ${String(actual)}`)
  }
}

const expectedEntries = Object.entries({
  pikachu: 25,
  bulbasaur: 1,
  squirtle: 7,
  charmander: 4,
  charizard: 6,
  terapagos: 1024,
  sprigatito: 906,
  quaxly: 912,
  fuecoco: 909,
  skeledirge: 911,
})
const expectedKeys = new Set(expectedEntries.map(([key]) => key))

runTests([
  {
    name: 'POKEMON_ID_MAP には10種類のエントリがある',
    run: () => {
      assertEqual(Object.keys(POKEMON_ID_MAP).length, 10, '定義済みのエントリ数')
    },
  },
  {
    name: '各ポケモンIDが契約通り',
    run: () => {
      for (const [key, value] of expectedEntries) {
        const actual = (POKEMON_ID_MAP as Record<string, number>)[key]
        assertEqual(actual, value, `${key} のPokeAPI ID`)
      }
    },
  },
  {
    name: '余計なキーが存在しない',
    run: () => {
      for (const key of Object.keys(POKEMON_ID_MAP)) {
        if (!expectedKeys.has(key)) {
          throw new Error(`未定義のキーが存在: ${key}`)
        }
      }
    },
  },
])

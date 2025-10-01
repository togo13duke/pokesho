import type { PieceType, Role } from './piece'

type AssertTrue<T extends true> = T

const EXPECTED_PIECE_TYPES = [
  'pikachu',
  'bulbasaur',
  'squirtle',
  'charmander',
  'charizard',
  'terapagos',
  'sprigatito',
  'quaxly',
  'fuecoco',
  'skeledirge',
] as const

type ExpectedPieceType = (typeof EXPECTED_PIECE_TYPES)[number]

const _allPieceTypesCovered: AssertTrue<Exclude<PieceType, ExpectedPieceType> extends never ? true : false> = true
const _noExtraPieceTypes: AssertTrue<Exclude<ExpectedPieceType, PieceType> extends never ? true : false> = true
void EXPECTED_PIECE_TYPES
void _allPieceTypesCovered
void _noExtraPieceTypes

const EXPECTED_ROLES = ['king', 'elephant', 'giraffe', 'chick', 'hen'] as const

type ExpectedRole = (typeof EXPECTED_ROLES)[number]

const _allRolesCovered: AssertTrue<Exclude<Role, ExpectedRole> extends never ? true : false> = true
const _noExtraRoles: AssertTrue<Exclude<ExpectedRole, Role> extends never ? true : false> = true
void EXPECTED_ROLES
void _allRolesCovered
void _noExtraRoles

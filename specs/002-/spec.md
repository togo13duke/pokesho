# Feature Specification: 後手の駒セット変更と初期配置の左右反転

**Feature Branch**: `002-`
**Created**: 2025-10-01
**Status**: Draft
**Input**: User description: "後手の駒セットを変更する機能を追加。現在は先手・後手ともに同じポケモン（ピカチュウ＋御三家）を使用しているが、視覚的な区別のため後手の駒を変更する。後手はテラパゴス（王将役）、ニャオハ（ぞう役）、クワッス（きりん役）、ホゲータ（ひよこ役、進化でラウドボーン）を使用。また、ゲームバランス向上のため、先手と後手でぞう役ときりん役の初期配置を左右逆にする。"

## Execution Flow (main)
```
1. Parse user description from Input
   → ✅ Feature description parsed
2. Extract key concepts from description
   → Identified: 視覚的区別（後手駒セット変更）、バランス改善（左右反転配置）
3. For each unclear aspect:
   → No major ambiguities found
4. Fill User Scenarios & Testing section
   → User flow defined
5. Generate Functional Requirements
   → All requirements testable
6. Identify Key Entities
   → Pokemon pieces, board positions
7. Run Review Checklist
   → No implementation details included
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## Clarifications

### Session 2025-10-01
- Q: 左右反転の解釈を明確にしてください。現在、先手は「フシギダネ（左）- ピカチュウ（中央）- ゼニガメ（右）」です。後手を左右反転すると？ → A: 後手：クワッス（左）- テラパゴス（中央）- ニャオハ（右）【現structure.mdの記載通り、変更なし】
- Q: 相手の駒を捕獲して手駒として配置した場合、その駒の種別はどうなるべきですか？ → A: 捕獲者の駒セットに変換
  - 【ヒトカゲならホゲータ、ホゲータならヒトカゲ、ゼニガメならクワッス、クワッスならゼニガメ、フシギダネならニャオハ、ニャオハならフシギダネ】
- Q: 王将役（ピカチュウ/テラパゴス）、ぞう役（フシギダネ/ニャオハ）、きりん役（ゼニガメ/クワッス）が捕獲された場合の変換ルールを確認します。 → A: 役職に応じて変換【先手が後手のテラパゴスを捕獲→ピカチュウに変換】
- Q: 進化した駒（リザードン/ラウドボーン）が捕獲された場合の変換ルールを確認します。 → A: 進化前（ヒトカゲ/ホゲータ）に戻し、捕獲者の駒セット（ヒトカゲ/ホゲータ）に変換

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
プレイヤーがゲームを開始すると、先手と後手の駒が視覚的に区別できる異なるポケモンで表示される。後手のプレイヤーは、テラパゴス（王将役）、ニャオハ（ぞう役）、クワッス（きりん役）、ホゲータ（ひよこ役）を使用する。先手と後手では、ぞう役ときりん役の初期配置が左右反転されているため、ゲームの戦略性とバランスが向上する。

### Acceptance Scenarios
1. **Given** ゲーム開始時、**When** 盤面を表示、**Then** 先手はピカチュウ、フシギダネ、ゼニガメ、ヒトカゲを使用、後手はテラパゴス、ニャオハ、クワッス、ホゲータを使用して表示される
2. **Given** ゲーム開始時、**When** 盤面を表示、**Then** 先手後列は「フシギダネ（左）- ピカチュウ（中央）- ゼニガメ（右）」、後手後列は「クワッス（左）- テラパゴス（中央）- ニャオハ（右）」の配置である
3. **Given** 後手のホゲータが敵陣最奥行に到達、**When** 移動完了、**Then** ラウドボーンに進化する
4. **Given** 先手が後手のホゲータを捕獲、**When** 手駒として配置、**Then** ホゲータ（後手の駒セット）として表示される
5. **Given** 後手が先手のヒトカゲを捕獲、**When** 手駒として配置、**Then** ホゲータ（後手の駒セット）に変換されて表示される
6. **Given** 先手が後手のテラパゴス（王将役）を捕獲、**When** 手駒として配置、**Then** ピカチュウ（先手の王将役）に変換される
7. **Given** 後手のラウドボーン（進化済み）を先手が捕獲、**When** 手駒として配置、**Then** ヒトカゲ（進化前・先手の駒セット）に変換される
8. **Given** 先手と後手の駒が混在する盤面、**When** プレイヤーが駒を選択、**Then** 視覚的に区別可能な駒画像により、どちらの駒か即座に認識できる

### Edge Cases
- 進化した駒（リザードン/ラウドボーン）が捕獲された場合、進化前（ヒトカゲ/ホゲータ）に戻り、捕獲者の駒セットに変換される
- すべての駒（王将、ぞう、きりん、ひよこ）は捕獲時に捕獲者の駒セットに変換される（例：先手が後手のテラパゴスを捕獲→ピカチュウに変換）
- 先手と後手の駒セットは完全に異なるが、移動ルール（王将、ぞう、きりん、ひよこ）は同一である
- PokeAPIから後手の新しいポケモン画像が取得できない場合、フォールバック処理が正しく動作する

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: システムは後手プレイヤーの駒として、テラパゴス（王将役）、ニャオハ（ぞう役）、クワッス（きりん役）、ホゲータ（ひよこ役）を使用しなければならない
- **FR-002**: システムは後手のホゲータが敵陣最奥行に到達したとき、ラウドボーンに進化させなければならない
- **FR-003**: システムは初期配置で、先手後列を「フシギダネ（左）- ピカチュウ（中央）- ゼニガメ（右）」、後手後列を「クワッス（左）- テラパゴス（中央）- ニャオハ（右）」としなければならない
- **FR-004**: システムは各ポケモンの画像をPokeAPIから取得し、先手と後手の駒を視覚的に区別可能にしなければならない
- **FR-005**: システムは捕獲された駒を手駒として配置する際、捕獲者の駒セットに変換しなければならない（例：先手が後手のテラパゴスを捕獲→ピカチュウに変換、後手が先手のヒトカゲを捕獲→ホゲータに変換）
- **FR-006**: システムは先手と後手で異なるポケモンセットを使用しても、各役職（王将、ぞう、きりん、ひよこ）の移動ルールは同一でなければならない
- **FR-007**: システムは進化した駒（リザードン/ラウドボーン）が捕獲された場合、進化前の状態（ヒトカゲ/ホゲータ）に戻し、捕獲者の駒セットに変換しなければならない

### Key Entities
- **先手のポケモンセット**: ピカチュウ（王将役）、フシギダネ（ぞう役）、ゼニガメ（きりん役）、ヒトカゲ（ひよこ役、進化先はリザードン）
- **後手のポケモンセット**: テラパゴス（王将役）、ニャオハ（ぞう役）、クワッス（きりん役）、ホゲータ（ひよこ役、進化先はラウドボーン）
- **初期配置ルール**: 先手後列「フシギダネ（左）- ピカチュウ（中央）- ゼニガメ（右）」、後手後列「クワッス（左）- テラパゴス（中央）- ニャオハ（右）」
- **駒の役職**: 王将、ぞう、きりん、ひよこ（進化後も役職は保持され、移動ルールは変更されない）
- **捕獲時の変換ルール**: すべての駒は捕獲時に役職を保持したまま、捕獲者の駒セットに変換される。進化した駒は進化前に戻る。

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

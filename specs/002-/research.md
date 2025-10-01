# Phase 0: Research - 後手の駒セット変更と初期配置の左右反転

**日付**: 2025-10-01
**対象機能**: 後手の駒セット変更と初期配置の左右反転

## 既存コードベース調査

### 現在の実装状況

#### 型定義 (`src/types/piece.ts`)
- `PieceType`: 現在は先手専用の5種類（`pikachu`, `bulbasaur`, `squirtle`, `charmander`, `charizard`）
- `Player`: `player1`（先手）と `player2`（後手）
- `Piece`: 駒の情報（id, type, owner, isPromoted, imageUrl）

#### ポケモンデータ (`src/constants/pokemon.ts`)
- `POKEMON_ID_MAP`: PieceTypeからPokeAPI IDへのマッピング
- 現在は先手用の5種類のみ定義

#### 初期配置 (`src/utils/initialBoard.ts`)
- `createInitialGameState()`: 初期盤面を生成
- 現在の配置:
  - player2後列: `bulbasaur`, `pikachu`, `squirtle`（左から右）
  - player1後列: `bulbasaur`, `pikachu`, `squirtle`（左から右）
  - 前列中央: 両者とも `charmander`

#### 移動ルール (`src/utils/moveRules.ts`)
- `MOVE_RULES`: 各PieceTypeごとの移動方向を定義
- 役職ごとのルール:
  - `pikachu`（王将）: 全方向1マス
  - `bulbasaur`（ぞう）: 斜め4方向
  - `squirtle`（きりん）: 縦横4方向
  - `charmander`（ひよこ）: 前方1マス
  - `charizard`（にわとり）: 前後左右+斜め前

#### ゲームロジック (`src/utils/gameLogic.ts`)
- `checkPikachuCapture()`: ピカチュウ捕獲による勝敗判定
- `checkTry()`: ピカチュウの敵陣最奥行到達による勝敗判定
- 現在はハードコードで `pikachu` を王将役として扱っている

### 変更が必要な箇所

1. **型定義の拡張** (`src/types/piece.ts`)
   - 後手用の4種類を追加: `terapagos`, `sprigatito`, `quaxly`, `fuecoco`, `skeledirge`

2. **ポケモンデータの追加** (`src/constants/pokemon.ts`)
   - 後手用ポケモンのPokeAPI IDを追加
   - PokeAPI ID:
     - テラパゴス (Terapagos): 1024
     - ニャオハ (Sprigatito): 906
     - クワッス (Quaxly): 912
     - ホゲータ (Fuecoco): 909
     - ラウドボーン (Skeledirge): 911

3. **初期配置の変更** (`src/utils/initialBoard.ts`)
   - player2の初期配置を後手用ポケモンに変更
   - 配置: `quaxly`, `terapagos`, `sprigatito`（左から右）

4. **移動ルールの追加** (`src/utils/moveRules.ts`)
   - 後手用ポケモンの移動ルールを追加（先手と同じ役職ルール）

5. **ゲームロジックの修正** (`src/utils/gameLogic.ts`)
   - `checkPikachuCapture()`: 王将役（`pikachu` と `terapagos`）の捕獲判定に変更
   - `checkTry()`: 王将役の敵陣到達判定に変更

6. **駒変換ロジックの追加**（新規）
   - 捕獲時に役職を保持し、捕獲者の駒セットに変換
   - 進化駒は進化前に戻す

### 憲法チェック

#### 原則との整合性

**I. シンプルで直感的なUI**
- ✅ 駒の視覚的区別により、先手と後手がより明確に
- ✅ 既存のワンクリック操作は変更なし
- ✅ 移動ルールは変更なし（役職は同じ）

**II. 最小限の依存関係**
- ✅ 新しいライブラリは不要
- ✅ PokeAPIからの画像取得は既存機能を利用

**III. ローカル優先設計**
- ✅ 新しいポケモン画像も既存のキャッシュ機構で対応
- ✅ オフライン動作に影響なし

**IV. パフォーマンス第一**
- ✅ 駒の種類が増えても、移動ロジックの計算量は変わらず
- ✅ 画像キャッシュは既存機構で対応

**V. アクセシビリティ**
- ✅ 視覚的な区別が改善（先手・後手の識別が容易に）
- ✅ alt属性やaria-labelは既存の仕組みで対応

#### 技術制約チェック
- ✅ React 19 + TypeScript環境を維持
- ✅ PokeAPIを利用
- ✅ クライアントサイドで完結
- ✅ バンドルサイズへの影響は最小限（画像はランタイム取得）

### 技術的決定事項

#### 1. 駒の識別方法
**決定**: `PieceType` を拡張し、後手用の5種類を追加

**理由**:
- 既存の型システムと整合性が高い
- 移動ルールの定義が明確
- 画像取得ロジックがシンプル

**代替案検討**:
- ❌ 役職（Role）と外見（Appearance）を分離: 複雑化し、憲法原則II（最小限の依存関係）に反する

#### 2. 駒変換ロジックの実装場所
**決定**: `src/utils/pieceConversion.ts` を新規作成

**理由**:
- 単一責任の原則
- テストが容易
- 既存コードへの影響を最小化

**代替案検討**:
- ❌ `gameLogic.ts` に追加: ファイルが肥大化し、保守性が低下

#### 3. 役職から駒への変換マッピング
**決定**: `ROLE_TO_PIECE_MAP` を定義し、役職 × プレイヤーから駒タイプを取得

**理由**:
- 捕獲時の変換ロジックが明確
- 拡張性が高い（将来的に駒セット追加が容易）

**代替案検討**:
- ❌ if-elseでハードコード: 保守性が低く、バグの温床

#### 4. PokeAPI ID の確認
**決定**: 以下のIDを使用
- テラパゴス (Terapagos): 1024
- ニャオハ (Sprigatito): 906
- クワッス (Quaxly): 912
- ホゲータ (Fuecoco): 909
- ラウドボーン (Skeledirge): 911

**理由**:
- PokeAPI公式の最新世代ポケモンID
- 画像が確実に取得可能

#### 5. 既存の画像キャッシュとの統合
**決定**: `src/utils/imageCache.ts` の既存機構をそのまま利用

**理由**:
- 新しいポケモンIDを追加するだけで対応可能
- キャッシュロジックの重複を避ける

**代替案検討**:
- ❌ 別のキャッシュ機構を作成: 憲法原則II（最小限の依存関係）に反する

### 実装方針

1. **型定義の拡張**: 後手用5種類を `PieceType` に追加
2. **駒変換ユーティリティの作成**: `pieceConversion.ts` で役職ベースの変換ロジックを実装
3. **初期配置の更新**: player2の初期配置を後手用ポケモンに変更
4. **移動ルールの追加**: 後手用ポケモンに対応するルールを追加
5. **ゲームロジックの修正**: 王将役の判定を汎用化
6. **PokeAPI IDマッピングの追加**: 後手用ポケモンのIDを追加

### リスクと対策

| リスク | 対策 |
|--------|------|
| PokeAPI画像取得の失敗 | 既存のフォールバック機構を利用（プレースホルダー画像） |
| 既存のゲームロジックとの非互換 | 役職ベースの抽象化により、移動ルールは変更なし |
| 型安全性の低下 | TypeScriptの型システムを活用し、厳密な型定義を維持 |

### 未解決事項

なし（すべての不明点は `/clarify` で解決済み）

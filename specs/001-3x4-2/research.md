# Research: ポケモン将棋

**Feature**: 001-3x4-2
**Date**: 2025-10-01
**Status**: Complete

## 目的

React + TypeScript + Viteでポケモン将棋を実装するための技術調査。PokeAPI画像キャッシュ、状態管理、パフォーマンス最適化に関するベストプラクティスを確認。

---

## 1. 画像キャッシュ戦略

### Decision
**localStorage** を使用してPokeAPIから取得した画像をBase64エンコードして保存

### Rationale
- **シンプル**: 同期API、追加ライブラリ不要
- **容量**: 5MB制限だが、今回は5種類のポケモン画像のみ（ピカチュウ、フシギダネ、ゼニガメ、ヒトカゲ、リザードン）なので十分
- **憲法準拠**: 最小限の依存関係（Principle II）

### Alternatives Considered
- **IndexedDB**: より大容量だが非同期APIで複雑化、今回の規模では過剰
- **Service Worker**: PWA対応だが実装コスト高、MVPスコープ外

### Implementation Details
```typescript
// src/utils/imageCache.ts
const CACHE_KEY_PREFIX = 'pokemon-image-';
const CACHE_TIMEOUT = 5000; // 5秒

async function fetchPokemonImage(pokemonId: number): Promise<string> {
  // 1. localStorage確認
  const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${pokemonId}`);
  if (cached) return cached;

  // 2. PokeAPI取得（5秒タイムアウト）
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CACHE_TIMEOUT);

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
      { signal: controller.signal }
    );
    const data = await response.json();
    const imageUrl = data.sprites.front_default;

    // 3. Base64エンコード
    const imageBlob = await fetch(imageUrl).then(r => r.blob());
    const base64 = await blobToBase64(imageBlob);

    // 4. localStorage保存
    localStorage.setItem(`${CACHE_KEY_PREFIX}${pokemonId}`, base64);
    return base64;
  } catch (error) {
    // 5. タイムアウトまたはエラー時はプレースホルダー
    return '/placeholder/piece-placeholder.png';
  } finally {
    clearTimeout(timeout);
  }
}
```

---

## 2. 状態管理アプローチ

### Decision
**React Hooks** (`useState`, `useReducer`) を使用、Zustandは不使用

### Rationale
- **シンプル**: 単一画面、グローバル状態不要
- **憲法準拠**: 最小限の依存関係（Principle II）
- **パフォーマンス**: `React.memo`と`useMemo`で最適化可能

### State Structure
```typescript
interface GameState {
  board: (Piece | null)[][];       // 3x4盤面
  capturedPieces: {
    player1: Piece[];              // 先手の手駒
    player2: Piece[];              // 後手の手駒
  };
  currentTurn: 'player1' | 'player2';
  gameStatus: 'playing' | 'player1_win' | 'player2_win';
  selectedPiece: { row: number; col: number } | null;
  validMoves: { row: number; col: number }[];
}
```

### Alternatives Considered
- **Zustand**: グローバル状態管理だが、今回は単一コンポーネントツリーで十分
- **Redux Toolkit**: 過剰、憲法違反（Principle II）

---

## 3. TailwindCSS設定

### Decision
デフォルト設定 + カスタムカラーパレット（ポケモンテーマ）

### Configuration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'poke-yellow': '#FFCB05',
        'poke-blue': '#3B4CCA',
        'poke-red': '#FF0000',
      },
      gridTemplateColumns: {
        '3': 'repeat(3, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '4': 'repeat(4, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
```

### Rationale
- **アクセシビリティ**: WC AG AAコントラスト比確保
- **憲法準拠**: 最小限の依存関係、追加プラグイン不要

---

## 4. パフォーマンス最適化

### Decision
- `React.memo` で Piece, Cell コンポーネントをメモ化
- `useMemo` で validMoves 計算結果をキャッシュ
- `useCallback` でイベントハンドラを安定化

### Code Pattern
```typescript
// src/components/Piece.tsx
export const Piece = React.memo(({ type, owner, imageUrl }: PieceProps) => {
  return (
    <img
      src={imageUrl}
      alt={`${owner}の${type}`}
      className="w-full h-full object-contain"
    />
  );
});

// src/hooks/useGameState.ts
const validMoves = useMemo(() => {
  if (!selectedPiece) return [];
  return calculateValidMoves(board, selectedPiece);
}, [board, selectedPiece]);
```

### Rationale
- **60fps維持**: 不要な再レンダリング削減
- **憲法準拠**: パフォーマンス第一（Principle IV）

---

## 5. PokeAPI使用ポケモン

### Pokemon IDs
- **25**: ピカチュウ (Pikachu)
- **1**: フシギダネ (Bulbasaur)
- **7**: ゼニガメ (Squirtle)
- **4**: ヒトカゲ (Charmander)
- **6**: リザードン (Charizard)

### API Endpoint Pattern
```
https://pokeapi.co/api/v2/pokemon/{id}
```

### Response Field
```json
{
  "sprites": {
    "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
}
```

---

## 6. エラーハンドリング

### Decision
- 画像取得失敗時: プレースホルダー画像を表示
- タイムアウト時: 5秒経過後にプレースホルダーを使用
- ネットワークエラー時: 同様にプレースホルダーを使用

### User Experience
- エラーメッセージは表示しない（憲法Principle I: シンプル）
- ゲームは常にプレイ可能な状態を維持

---

## 7. アクセシビリティ対応

### ARIA Labels
```tsx
<div
  role="grid"
  aria-label="3×4のポケモン将棋盤面"
>
  <button
    role="gridcell"
    aria-label={`${row}行${col}列: ${piece ? `${piece.owner}の${piece.type}` : '空きマス'}`}
    onClick={handleCellClick}
  >
    {piece && <Piece {...piece} />}
  </button>
</div>
```

### Keyboard Navigation
- Tab順: 盤面 → 手駒エリア → リスタートボタン
- Enter/Space: セル選択、駒移動
- Escape: 選択解除

### Color Contrast
- ハイライト色: `bg-yellow-300` (WCAG AA準拠)
- テキスト: `text-gray-900` on `bg-white`

---

## 8. ディレクトリ構成の理由

### Components分離
- **Atomic Design不採用**: 過剰な抽象化を避ける（憲法Principle I）
- **機能別コンポーネント**: Board, Piece, CapturedPieces など役割が明確

### Hooks分離
- **カスタムHooks**: useGameState, useImageCache で関心の分離
- **再利用性**: 将来の拡張に備える

### Utils分離
- **Pure Functions**: moveRules, gameLogic はテスト容易性を考慮
- **単一責任**: 各ファイルは1つの責務のみ

---

## 決定事項サマリー

| 項目 | 決定内容 | 理由 |
|-----|---------|------|
| 画像キャッシュ | localStorage + Base64 | シンプル、容量十分 |
| 状態管理 | React Hooks のみ | 単一画面、外部ライブラリ不要 |
| スタイリング | TailwindCSS デフォルト | 最小限の設定、憲法準拠 |
| 最適化 | React.memo + useMemo | 60fps維持 |
| エラー処理 | プレースホルダー画像 | ゲーム継続性優先 |
| アクセシビリティ | ARIA + キーボード対応 | 憲法Principle V準拠 |

---

## 次のステップ

Phase 1でdata-model.md、quickstart.mdを作成し、詳細な型定義とテストシナリオを文書化。

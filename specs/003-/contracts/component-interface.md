# Component Interface Contracts - 後手駒の向き反転と視認性向上

**作成日**: 2025-10-04
**対象機能**: spec 003 - 後手駒の向き反転と視認性向上

## 概要

この機能はUI専用のため、API contractsではなく、Reactコンポーネント間のインターフェース契約を定義する。

---

## 1. Piece Component Contract

### Input Props

```typescript
interface PieceProps {
  piece: Piece;         // 必須: 駒情報（type, position, player含む）
  onClick?: () => void; // オプション: クリックハンドラ
}
```

### Output (Rendering)

**必須要素**:
1. **駒画像**: `<img>` タグでポケモン画像を表示
2. **回転**: `piece.player === 'player2'` の場合、`rotate-180` クラスを適用
3. **移動方向マーカー**: 駒の周囲にSVG三角形/点を配置
   - マーカー数: 駒タイプに応じて1~8個
   - 配置位置: 上下左右および斜め方向
   - スタイル: 駒画像と明確に区別できる色（例: `text-gray-600`）
   - アクセシビリティ: 各マーカーに `aria-label="[方向]に移動可能"` を付与

### Contract Test

```typescript
describe('Piece Component', () => {
  it('後手の駒は180度回転して表示される', () => {
    const piece: Piece = { type: 'pikachu', player: 'player2', position: { row: 0, col: 1 } };
    const { container } = render(<Piece piece={piece} />);
    const rotatedElement = container.querySelector('.rotate-180');
    expect(rotatedElement).toBeInTheDocument();
  });

  it('先手の駒は回転しない', () => {
    const piece: Piece = { type: 'pikachu', player: 'player1', position: { row: 2, col: 1 } };
    const { container } = render(<Piece piece={piece} />);
    const rotatedElement = container.querySelector('.rotate-180');
    expect(rotatedElement).not.toBeInTheDocument();
  });

  it('移動方向マーカーが駒タイプに応じて表示される', () => {
    const piece: Piece = { type: 'pikachu', player: 'player1', position: { row: 1, col: 1 } };
    const { container } = render(<Piece piece={piece} />);
    const markers = container.querySelectorAll('svg[aria-label*="移動可能"]');
    expect(markers.length).toBeGreaterThan(0); // ピカチュウは複数方向に移動可能
  });

  it('各マーカーにアクセシビリティラベルが付与される', () => {
    const piece: Piece = { type: 'bulbasaur', player: 'player1', position: { row: 1, col: 0 } };
    const { getByLabelText } = render(<Piece piece={piece} />);
    expect(() => getByLabelText(/移動可能/)).not.toThrow();
  });
});
```

---

## 2. Board Component Contract

### Input Props

```typescript
interface BoardProps {
  board: CellState[][];
  onCellClick: (row: number, col: number) => void;
  currentTurn: Player;      // 必須: ターン表示色の判定に使用
  selectedPosition?: Position;
}
```

### Output (Rendering)

**必須要素**:
1. **背景色**: `currentTurn === 'player1'` → `bg-blue-50`, `'player2'` → `bg-red-50`
2. **セルの配置**: 3×4グリッド（既存実装）
3. **駒の表示**: 各セルに対応する `<Piece>` コンポーネント

### Contract Test

```typescript
describe('Board Component', () => {
  it('先手のターンでは青い背景色が適用される', () => {
    const { container } = render(<Board board={mockBoard} currentTurn="player1" onCellClick={jest.fn()} />);
    const boardElement = container.querySelector('.bg-blue-50');
    expect(boardElement).toBeInTheDocument();
  });

  it('後手のターンでは赤い背景色が適用される', () => {
    const { container } = render(<Board board={mockBoard} currentTurn="player2" onCellClick={jest.fn()} />);
    const boardElement = container.querySelector('.bg-red-50');
    expect(boardElement).toBeInTheDocument();
  });

  it('ターンが切り替わると背景色が変化する', () => {
    const { container, rerender } = render(<Board board={mockBoard} currentTurn="player1" onCellClick={jest.fn()} />);
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();

    rerender(<Board board={mockBoard} currentTurn="player2" onCellClick={jest.fn()} />);
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-blue-50')).not.toBeInTheDocument();
  });
});
```

---

## 3. TurnDisplay Component Contract

### Input Props

```typescript
interface TurnDisplayProps {
  currentTurn: Player; // 必須: ターン表示色の判定に使用
}
```

### Output (Rendering)

**必須要素**:
1. **背景色**: `currentTurn === 'player1'` → `bg-blue-50`, `'player2'` → `bg-red-50`
2. **テキスト**: 現在のターン（先手/後手）を表示

### Contract Test

```typescript
describe('TurnDisplay Component', () => {
  it('先手のターンでは青い背景色とテキストが表示される', () => {
    const { container, getByText } = render(<TurnDisplay currentTurn="player1" />);
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    expect(getByText(/先手/)).toBeInTheDocument();
  });

  it('後手のターンでは赤い背景色とテキストが表示される', () => {
    const { container, getByText } = render(<TurnDisplay currentTurn="player2" />);
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
    expect(getByText(/後手/)).toBeInTheDocument();
  });
});
```

---

## 4. CapturedPieces Component Contract

### Input Props

```typescript
interface CapturedPiecesProps {
  pieces: Piece[];   // 必須: 捕獲された駒のリスト
  player: Player;    // 必須: 所有プレイヤー（固定背景色の判定）
  onPieceClick?: (piece: Piece) => void;
}
```

### Output (Rendering)

**必須要素**:
1. **背景色**: `player === 'player1'` → `bg-blue-50`, `'player2'` → `bg-red-50`
   - **重要**: ターンに関わらず常に所有プレイヤーの色を表示
2. **手駒表示**: 各駒を `<Piece>` コンポーネントで表示
   - 駒の向きは所有プレイヤーに合わせて回転

### Contract Test

```typescript
describe('CapturedPieces Component', () => {
  it('先手の手駒エリアは常に青い背景色', () => {
    const { container } = render(<CapturedPieces pieces={[]} player="player1" />);
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
  });

  it('後手の手駒エリアは常に赤い背景色', () => {
    const { container } = render(<CapturedPieces pieces={[]} player="player2" />);
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
  });

  it('ターンが変わっても手駒エリアの色は変わらない', () => {
    // この契約を満たすため、CapturedPiecesはcurrentTurnを受け取らない
    const { container } = render(<CapturedPieces pieces={[]} player="player1" />);
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    // ターン変更後も同じ（親コンポーネントで検証）
  });

  it('手駒の駒は所有プレイヤーの向きで表示される', () => {
    const capturedPiece: Piece = { type: 'bulbasaur', player: 'player2', position: { row: -1, col: -1 } };
    const { container } = render(<CapturedPieces pieces={[capturedPiece]} player="player1" />);
    // 元々player2の駒だが、現在の所有者player1の向き（回転なし）で表示
    const rotatedElement = container.querySelector('.rotate-180');
    expect(rotatedElement).not.toBeInTheDocument();
  });
});
```

---

## 5. Utility Functions Contract

### getPossibleMoveDirections

**シグネチャ**:
```typescript
function getPossibleMoveDirections(pieceType: PieceType, player: Player): Direction[]
```

**入力**:
- `pieceType`: 'pikachu' | 'bulbasaur' | 'squirtle' | 'charmander' | 'charizard'
- `player`: 'player1' | 'player2'（方向の相対判定に使用）

**出力**:
- `Direction[]`: 移動可能な方向のリスト
  - 例: `['up', 'upLeft', 'upRight', 'left', 'right', 'down']`

**契約**:
- ピカチュウ: 6方向（前方3、左右、後方1）
- フシギダネ/ゼニガメ/ヒトカゲ: 1方向（前方のみ）
- リザードン: 6方向（ピカチュウと同等）

**Contract Test**:
```typescript
describe('getPossibleMoveDirections', () => {
  it('ピカチュウは6方向に移動可能', () => {
    const directions = getPossibleMoveDirections('pikachu', 'player1');
    expect(directions).toHaveLength(6);
    expect(directions).toContain('up');
    expect(directions).toContain('down');
  });

  it('フシギダネは前方1方向のみ', () => {
    const directions = getPossibleMoveDirections('bulbasaur', 'player1');
    expect(directions).toHaveLength(1);
    expect(directions).toContain('up');
  });

  it('後手の駒は方向が反転する', () => {
    const directionsPlayer1 = getPossibleMoveDirections('bulbasaur', 'player1');
    const directionsPlayer2 = getPossibleMoveDirections('bulbasaur', 'player2');
    expect(directionsPlayer1).toContain('up');
    expect(directionsPlayer2).toContain('down'); // player2の「前方」はdown
  });
});
```

---

## Contract Validation Strategy

### 自動テスト
- すべてのcontract testを `npm run test` で実行
- CI/CDパイプラインで継続的に検証

### 手動検証
- ブラウザでの視覚的確認（`npm run dev`）
- アクセシビリティ検証（スクリーンリーダー、キーボード操作）
- パフォーマンス検証（Chrome DevTools Performance タブ）

### 受け入れ基準
- すべてのcontract testがPASS
- spec.mdのAcceptance Scenariosをすべて満たす
- 60fps維持（駒移動時のパフォーマンス）

# ポケモン将棋（Pokesho）

ポケモンキャラクターで楽しむ、どうぶつしょうぎベースのブラウザ将棋ゲーム。
3×4の盤面で2人対戦、取った駒を使う手駒システム、進化（成り）機能を搭載。

## 🎮 ゲーム概要

- **ルール**: どうぶつしょうぎを忠実に再現
- **駒**: 先手と後手で異なるポケモンを使用
  - **先手**: ピカチュウ、フシギダネ、ゼニガメ、ヒトカゲ（進化→リザードン）
  - **後手**: テラパゴス、ニャオハ、クワッス、ホゲータ（進化→ラウドボーン）
- **勝利条件**:
  - 相手の王将役（ピカチュウ/テラパゴス）を取る
  - 自分の王将役を相手陣地最奥行に到達させる（トライ）

## 🎯 主な機能

- ✅ 3×4マスの盤面で2人対戦
- ✅ 移動可能マスのハイライト表示
- ✅ 後手駒の180度回転表示（視認性向上）
- ✅ 各駒に移動可能方向マーカー表示
- ✅ ターン別の盤面背景色変更（先手：青系、後手：赤系）
- ✅ 手駒システム（取った駒を盤上に配置）
- ✅ 進化システム（ヒトカゲ→リザードン、ホゲータ→ラウドボーン）
- ✅ ターン表示（先手の番/後手の番）
- ✅ PokeAPIから画像取得（キャッシュ機能付き）
- ✅ オフライン対応（画像フォールバック処理）
- ✅ アクセシビリティ対応（ARIA属性、キーボード操作）

## 📋 駒対応表

| どうぶつしょうぎ | 動き | 先手ポケモン | 後手ポケモン |
|---|---|---|---|
| ライオン | 全方向1マス | ピカチュウ | テラパゴス |
| ぞう | 斜め1マス | フシギダネ | ニャオハ |
| きりん | 縦横1マス | ゼニガメ | クワッス |
| ひよこ | 前1マス | ヒトカゲ | ホゲータ |
| にわとり（成り） | 前後左右+斜め前 | リザードン | ラウドボーン |

## 🚀 クイックスタート

[すぐ遊ぶ](https://pokesho.duke13.com)

### 必要環境

- Node.js 18以上
- npm 9以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/togo13duke/pokesho.git
cd pokesho

# 依存関係をインストール
npm install
```

### 開発

```bash
# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# ビルドをプレビュー
npm run preview

# Lintチェック
npm run lint
```

## 🛠️ 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7（HMR対応）
- **スタイリング**: Tailwind CSS 3.4
- **Linting**: ESLint 9 + TypeScript ESLint
- **画像取得**: PokeAPI（キャッシュ機能付き）

## 📁 プロジェクト構成

```
pokesho/
├── src/
│   ├── App.tsx           # メインアプリケーション
│   ├── components/       # UIコンポーネント
│   │   ├── Board.tsx     # 盤面表示（ターン別背景色）
│   │   ├── Cell.tsx      # マス目
│   │   ├── Piece.tsx     # 駒表示（回転＋方向マーカー）
│   │   ├── CapturedPieces.tsx  # 手駒表示
│   │   ├── TurnDisplay.tsx     # ターン表示
│   │   └── GameOverMessage.tsx # 勝敗メッセージ
│   ├── hooks/            # カスタムフック
│   │   ├── useGameState.ts     # ゲーム状態管理
│   │   └── useImageCache.ts    # 画像キャッシュ
│   ├── utils/            # ゲームロジック
│   │   ├── gameLogic.ts        # 勝敗判定
│   │   ├── moveRules.ts        # 移動ルール＋方向取得
│   │   ├── initialBoard.ts     # 初期配置
│   │   ├── pieceConversion.ts  # 駒変換（手駒→盤上）
│   │   └── imageCache.ts       # 画像取得
│   ├── types/            # 型定義
│   │   ├── game.ts       # GameState, Position, PlayerColor等
│   │   └── piece.ts      # PieceType, Player, Role, Direction等
│   └── constants/        # 定数
│       ├── pokemon.ts    # ポケモンID、画像URL等
│       └── colors.ts     # ターン別カラー定数
├── specs/                # 仕様書
│   ├── 001-3x4-2/        # spec 001: 初期実装
│   ├── 002-/             # spec 002: 後手駒セット変更
│   └── 003-/             # spec 003: 駒回転＋視認性向上
├── docs/                 # ドキュメント
│   ├── progress.md       # 実装進捗ログ
│   └── steering/         # プロダクト設計
│       ├── product.md    # プロダクト概要
│       ├── structure.md  # 駒対応表・盤面構成
│       └── tech.md       # 技術設計
└── .claude/commands/     # Claude Code ワークフロー
```

## 📖 仕様書

- **[spec 001-3x4-2](./specs/001-3x4-2/spec.md)**: ポケモン将棋の初期実装
  - 3×4盤面、駒移動、手駒システム、進化、勝敗判定
- **[spec 002-](./specs/002-/spec.md)**: 後手駒セット変更と初期配置左右反転
  - 後手に第9世代御三家（テラパゴス、ニャオハ、クワッス、ホゲータ）を導入
- **[spec 003-](./specs/003-/spec.md)**: 後手駒の向き反転と視認性向上
  - 後手駒180度回転、移動方向マーカー表示、ターン別背景色

詳細な実装計画は各仕様書の `plan.md`、進捗状況は `tasks.md` を参照してください。

## 🧪 テスト

契約テストと統合テストを実装済み（TypeScriptコンパイル検証済み）：

```bash
# テストコードの型チェック
npx tsc -p tsconfig.tests.json

# テスト実行（ローカル環境）
npx tsx --experimental-specifier-resolution=node src/**/*.test.ts
```

テストファイル：
- `src/types/piece.test.ts` - 型定義の網羅性検証
- `src/constants/pokemon.test.ts` - ポケモンID/名前マッピング契約
- `src/constants/pokemon.integration.test.ts` - PokeAPI統合テスト
- `src/utils/pieceConversion.test.ts` - 駒変換ロジック
- `src/utils/initialBoard.test.ts` - 初期配置検証

## 🎨 デザイン原則

プロジェクトは以下の5つの原則に基づいて設計されています：

1. **シンプルで直感的なUI**: ハイライト表示、明確なターン表示
2. **最小限の依存関係**: React、Vite、Tailwind CSSのみ
3. **オフライン対応**: 画像キャッシュとフォールバック処理
4. **パフォーマンス最適化**: useMemo/useCallback、React.memo
5. **アクセシビリティ**: ARIA属性、キーボード操作対応

## 📊 ビルドサイズ

- **本番ビルド**: 202.65 kB
- **gzip圧縮後**: 64.26 kB
- **目標**: 500 kB以下 ✅

## 🔧 開発ワークフロー

Claude Code（`claude.ai/code`）を使用した自動実装ワークフロー：

```bash
# 実装を継続（.claude/commands/implement.mdを自動実行）
codex exec "continue implementing" --full-auto
```

詳細は `CLAUDE.md` を参照してください。

## 📝 進捗ログ

最新の実装進捗は [docs/progress.md](./docs/progress.md) を参照してください。

## 🤝 コントリビューション

このプロジェクトは現在個人開発中です。バグ報告や機能提案は Issue にてお願いします。

## 📄 ライセンス

MIT

## 🙏 謝辞

- **どうぶつしょうぎ**: ゲームルールの参考元
- **PokeAPI**: ポケモン画像の提供元
- **Pokémon**: © 2025 Pokémon. © 1995-2025 Nintendo/Creatures Inc./GAME FREAK inc.

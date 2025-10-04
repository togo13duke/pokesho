/**
 * ターン表示色の定義
 * - 先手: 薄い青 (#eff6ff = Tailwind blue-50)
 * - 後手: 薄い赤 (#fef2f2 = Tailwind red-50)
 */
export const TURN_COLORS = {
  player1: 'bg-blue-50',
  player2: 'bg-red-50',
} as const

/**
 * アクセシビリティ情報
 * - WCAG AAコントラスト比: 両色ともblackテキストに対して17:1以上
 */
export const COLOR_CONTRAST_INFO = {
  'bg-blue-50': { hex: '#eff6ff', contrastRatio: 17.5 },
  'bg-red-50': { hex: '#fef2f2', contrastRatio: 18.2 },
} as const

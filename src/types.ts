export type Kind = 'alma' | 'fb' | 'tip'

export interface AlmaMsg {
  /** Message body — may contain inline HTML (e.g. <b>). */
  html: string
  kind?: Kind
}

export type Trade = 'stock' | 'bond'

export interface Decisions {
  trade: Trade | null
  portfolio: Record<string, number> | null
}

export const BASE = 12

/** Resolve a path inside /public, honoring Vite's configured base. */
export const asset = (p: string) => import.meta.env.BASE_URL + p

export const fmt = (n: number) => '₪' + Math.round(n).toLocaleString('en-US')
export const clamp = (v: number) => Math.max(0, Math.min(100, v))

export const riskLabel = (v: number) =>
  v < 30 ? 'סיכון נמוך' : v < 55 ? 'סיכון בינוני' : v < 78 ? 'סיכון גבוה' : 'סיכון גבוה מאוד'

export const profitLabel = (v: number) =>
  v < 30 ? 'פוטנציאל נמוך' : v < 55 ? 'פוטנציאל בינוני' : v < 78 ? 'פוטנציאל גבוה' : 'פוטנציאל גבוה מאוד'

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const nowStr = () => {
  const d = new Date()
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
}

import type { ReactNode } from 'react'

function S({ children, size = 24, sw = 2 }: { children: ReactNode; size?: number; sw?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export const IconChart = () => (
  <S size={20} sw={2.2}>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-5 3 3 5-7" />
  </S>
)
export const IconRisk = () => (
  <S size={18}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </S>
)
export const IconProfit = () => (
  <S size={18}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </S>
)
export const IconBack = () => (
  <S size={16} sw={2.4}>
    <polyline points="9 18 15 12 9 6" />
  </S>
)
export const IconInfo = () => (
  <S size={14}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
    <path d="M12 16v-4M12 8h.01" />
  </S>
)
export const IconSeal = () => (
  <S size={44}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </S>
)

export const IconPerson = () => (
  <S>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </S>
)
export const IconBuilding = () => (
  <S>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </S>
)
export const IconGov = () => (
  <S>
    <path d="M3 21h18M4 10h16M5 21V10M19 21V10M12 3 4 7h16zM9 21v-7M15 21v-7" />
  </S>
)
export const IconBank = () => (
  <S>
    <path d="M3 10h18M5 10v9M19 10v9M9 10v9M15 10v9M3 19h18M12 3 3 7h18z" />
  </S>
)
export const IconShield = () => (
  <S>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </S>
)

export type PartIconKey = 'person' | 'building' | 'gov' | 'bank' | 'shield'

export function PartIcon({ k }: { k: PartIconKey }) {
  switch (k) {
    case 'person':
      return <IconPerson />
    case 'building':
      return <IconBuilding />
    case 'gov':
      return <IconGov />
    case 'bank':
      return <IconBank />
    case 'shield':
      return <IconShield />
  }
}

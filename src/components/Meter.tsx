import { useEffect, useRef, useState } from 'react'
import { profitLabel, riskLabel } from '../lib/utils'
import { IconProfit, IconRisk } from '../lib/icons'
import { useSim } from '../state/SimContext'

export default function Meter({ kind }: { kind: 'risk' | 'profit' }) {
  const { risk, profit, flashTick } = useSim()
  const value = kind === 'risk' ? risk : profit
  const label = kind === 'risk' ? riskLabel(value) : profitLabel(value)

  const [flash, setFlash] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setFlash(true)
    const t = window.setTimeout(() => setFlash(false), 1100)
    return () => window.clearTimeout(t)
  }, [flashTick])

  return (
    <div className={'meter-card ' + kind + (flash ? ' flash' : '')}>
      <div className="meter-head">
        <span className="name">
          {kind === 'risk' ? <IconRisk /> : <IconProfit />}
          {kind === 'risk' ? 'מד סיכון' : 'פוטנציאל תשואה'}
        </span>
        <span className="pct mono">{Math.round(value)}%</span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ transform: `scaleX(${value / 100})` }} />
        {kind === 'risk' && <div className="meter-seg" />}
      </div>
      <div className="meter-note">{label}</div>
    </div>
  )
}

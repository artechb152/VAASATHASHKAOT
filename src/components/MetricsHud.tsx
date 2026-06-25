import { profitLabel, riskLabel } from '../lib/utils'
import { useSim } from '../state/SimContext'

function Ring({ value, color }: { value: number; color: string }) {
  const r = 34
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  const offset = c * (1 - v / 100)
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`${Math.round(v)} אחוז`}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="8" />
      <circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 42 42)"
        style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)' }}
      />
      <text x="42" y="48" textAnchor="middle" className="mhud-num">
        {Math.round(v)}%
      </text>
    </svg>
  )
}

export default function MetricsHud() {
  const { risk, profit } = useSim()
  return (
    <div className="mhud" aria-label="מדדי סיכון ותשואה">
      <div className="mhud-gauge">
        <Ring value={risk} color="#d9b34a" />
        <div className="mhud-lbl">מד סיכון</div>
        <div className="mhud-sub">{riskLabel(risk).replace('סיכון ', '')}</div>
      </div>
      <div className="mhud-div" />
      <div className="mhud-gauge">
        <Ring value={profit} color="#52d07a" />
        <div className="mhud-lbl">פוטנציאל תשואה</div>
        <div className="mhud-sub">{profitLabel(profit).replace('פוטנציאל ', '')}</div>
      </div>
    </div>
  )
}

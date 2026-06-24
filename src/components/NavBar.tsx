import { useSim } from '../state/SimContext'

interface Props {
  hint?: string
  continueLabel?: string
  showContinue?: boolean
  lockContinue?: boolean
  onContinue?: () => void
}

export default function NavBar({
  hint,
  continueLabel = 'המשך',
  showContinue = true,
  lockContinue = false,
  onContinue,
}: Props) {
  const { step, back, next } = useSim()
  return (
    <div className="navbar">
      {step > 0 && (
        <button className="btn btn-ghost btn-sm" onClick={back}>
          ▸ חזרה
        </button>
      )}
      <div className="spacer" />
      {hint && <span className="hint">{hint}</span>}
      {showContinue && (
        <button className="btn btn-primary" disabled={lockContinue} onClick={onContinue || next}>
          {continueLabel} ◂
        </button>
      )}
    </div>
  )
}

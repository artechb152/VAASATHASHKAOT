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
  const { next } = useSim()
  return (
    <div className="navbar">
      <div className="spacer" />
      {hint && <span className="hint">{hint}</span>}
      {showContinue && (
        <button className="btn btn-primary" disabled={lockContinue} onClick={onContinue || next}>
          {continueLabel}
        </button>
      )}
    </div>
  )
}

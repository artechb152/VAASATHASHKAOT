import { fmt } from '../lib/utils'
import { IconBack, IconChart } from '../lib/icons'
import { STEPS } from '../data/content'
import { useSim } from '../state/SimContext'
import Meter from './Meter'

export default function Header() {
  const { step, back, goto, done, maxReached } = useSim()

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button
          className="topback"
          onClick={back}
          disabled={step === 0}
          aria-label="חזרה למסך הקודם"
          title="חזרה למסך הקודם"
        >
          <IconBack />
          חזרה
        </button>

        <div className="brand">
          <span className="logo" aria-hidden="true">
            <IconChart />
          </span>
          וועדת ההשקעות
        </div>

        <div className="budget">
          <span className="lbl">תקציב ההשקעה</span>
          <span className="val mono">{fmt(1_000_000)}</span>
        </div>
      </div>

      <div className="dash">
        <Meter kind="risk" />
        <Meter kind="profit" />
      </div>

      <nav className="stepper" aria-label="התקדמות">
        {STEPS.map((st, i) => {
          const cls =
            'step-dot' + (i === step ? ' active' : '') + (done[i] && i !== step ? ' done' : '')
          return (
            <button
              key={st.key}
              className={cls}
              title={st.label}
              disabled={i > maxReached}
              onClick={() => goto(i)}
            >
              <span className="n">{done[i] && i !== step ? '✓' : i + 1}</span>
              {st.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

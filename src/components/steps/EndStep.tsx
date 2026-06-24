import { useEffect, useState } from 'react'
import { TERMS } from '../../data/content'
import { profitLabel, riskLabel } from '../../lib/utils'
import { IconSeal } from '../../lib/icons'
import { useSim } from '../../state/SimContext'

export default function EndStep() {
  const { almaSequence, setAlmaPointing, markDone, risk, profit, goto } = useSim()
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setAlmaPointing(false)
    if (!submitted) {
      almaSequence([
        { html: 'עשיתם עבודה יוצאת מן הכלל היום.' },
        { html: 'לפני שניפרד — אני רוצה לשמוע אתכם. השלימו את המשפט "שוק ההון חשוב משום ש…" במילים שלכם.' },
        { html: 'אחר כך אראה לכם סיכום שמחבר את כל מה שלמדנו.', kind: 'tip' },
      ])
    }
  }, [almaSequence, setAlmaPointing, submitted])

  function finish() {
    markDone()
    setSubmitted(true)
    almaSequence([
      { html: 'זהו, סיימנו! הנה תמונת המצב של ההחלטות שלכם:' },
      {
        html: `מד הסיכון הסופי שלכם עומד על <b>${Math.round(risk)}%</b> (${riskLabel(risk)}), ופוטנציאל התשואה על <b>${Math.round(profit)}%</b> (${profitLabel(profit)}).`,
        kind: 'fb',
      },
      {
        html: 'היה לי תענוג ללוות אתכם. עכשיו אתם יודעים להסביר מה זה שוק ההון, להבחין בין מניה לאג״ח, ולהבין את הקשר בין סיכון לתשואה.',
      },
    ])
  }

  if (submitted) {
    const trimmed = answer.trim()
    const tail = trimmed.replace(/^ש/, '')
    return (
      <>
        <div className="card">
          <div className="finale">
            <div className="seal">
              <IconSeal />
            </div>
            <div className="kicker" style={{ justifyContent: 'center' }}>
              הסימולציה הושלמה
            </div>
            <h2>כל הכבוד, חבר/ת ועדה!</h2>
            <p className="lead" style={{ margin: '8px auto 0' }}>
              עברתם את כל שלבי הוועדה — מהיכרות עם שוק ההון ועד בניית תיק השקעות אמיתי.
            </p>
          </div>
          {trimmed && <div className="your-answer">"שוק ההון חשוב משום ש{tail}"</div>}
        </div>

        <div className="card">
          <div className="kicker">סיכום המושגים</div>
          <h3 style={{ fontSize: 22, marginBottom: 6 }}>כל מה שלמדתם, במקום אחד</h3>
          <p style={{ color: 'var(--on-variant)', fontSize: 15, margin: '0 0 14px' }}>
            עשרת המושגים שמרכיבים את התמונה המלאה של שוק ההון.
          </p>
          <div className="glossary">
            {TERMS.map(([t, d]) => (
              <div className="gl" key={t}>
                <b>{t}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="navbar">
          <button className="btn btn-ghost btn-sm" onClick={() => goto(6)}>
            ▸ חזרה
          </button>
          <div className="spacer" />
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            להתחיל מחדש ↻
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="card reflect">
      <div className="kicker">שלב 8 · רפלקציה</div>
      <h2>מילה אחרונה לפני שמסכמים</h2>
      <div className="sentence-stem">"שוק ההון חשוב משום ש…"</div>
      <p style={{ color: 'var(--on-variant)', fontSize: 15, margin: '0 0 12px' }}>
        השלימו את המשפט במילים שלכם. אין נכון או לא נכון — זו ההזדמנות שלכם לנסח מה הבנתם.
      </p>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="כתבו כאן…" />
      <button
        className="btn btn-primary"
        style={{ marginTop: 16 }}
        disabled={answer.trim().length < 3}
        onClick={finish}
      >
        לסיום ולצפייה בסיכום ◂
      </button>
    </div>
  )
}

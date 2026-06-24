import { useEffect, useState } from 'react'
import { CONNECT_Q } from '../../data/content'
import { IconBank, IconBuilding, IconPerson } from '../../lib/icons'
import { useSim } from '../../state/SimContext'
import NavBar from '../NavBar'

export default function ConnectStep() {
  const { almaSequence, setAlmaPointing, markDone, almaSay } = useSim()
  const [answered, setAnswered] = useState<Record<number, number>>({})

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'עכשיו נחבר את כל החתיכות.' },
      { html: 'תסתכלו על הדיאגרמה: הכסף זורם מהמשקיע, דרך הבורסה, אל החברה או הממשלה.' },
      { html: 'ובתמורה? המשקיע מקבל בעלות, ריבית או תשואה. ענו על השאלות ונמשיך.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  const allAnswered = Object.keys(answered).length === CONNECT_Q.length

  function choose(qi: number, oi: number) {
    if (qi in answered) return
    const upd = { ...answered, [qi]: oi }
    setAnswered(upd)
    if (Object.keys(upd).length === CONNECT_Q.length) {
      markDone()
      almaSay('יופי! הבנתם בדיוק איך הכסף זורם בשוק ההון.', 'fb')
    }
  }

  return (
    <>
      <div className="card">
        <div className="kicker">שלב 5 · איך הכול מתחבר</div>
        <h2>מסע הכסף בשוק ההון</h2>
        <p className="lead">
          שוק ההון מחבר בין מי שיש לו כסף פנוי לבין מי שצריך כסף. חברות וממשלות מנפיקות מניות או אג״ח,
          המשקיעים קונים אותן, וכך הכסף עובר מהציבור אל הגופים — ובתמורה המשקיעים מקווים לתשואה.
        </p>
        <div className="hr" />
        <div className="flow">
          <div className="node inv">
            <span className="ic"><IconPerson /></span>
            <h4>המשקיע</h4>
            <p>נותן את הכסף ומחפש תשואה</p>
          </div>
          <div className="arrow">◂</div>
          <div className="node mkt">
            <span className="ic"><IconBank /></span>
            <h4>שוק ההון / הבורסה</h4>
            <p>מתווך את העסקה</p>
          </div>
          <div className="arrow">◂</div>
          <div className="node dst">
            <span className="ic"><IconBuilding /></span>
            <h4>חברה / ממשלה</h4>
            <p>מקבלת מימון</p>
          </div>
        </div>
        <div className="flow-back">
          ↩ ובתמורה חוזר אל המשקיע: בעלות (מניה), החזר עם ריבית (אג״ח), או תשואה
        </div>
      </div>

      <div className="card">
        <div className="kicker">בדיקת הבנה</div>
        <h3 style={{ fontSize: 22, marginBottom: 14 }}>מי עושה מה?</h3>
        {CONNECT_Q.map((item, qi) => {
          const isDone = qi in answered
          const chosen = answered[qi]
          return (
            <div className="q-block" key={qi}>
              <div className="q">
                <span className="qn">{qi + 1}.</span>
                <span>{item.q}</span>
              </div>
              {item.opts.map((opt, oi) => {
                let cls = 'opt'
                if (isDone && oi === item.correct) cls += ' correct'
                else if (isDone && oi === chosen) cls += ' wrong'
                return (
                  <button key={oi} className={cls} disabled={isDone} onClick={() => choose(qi, oi)}>
                    {opt}
                    {isDone && oi === item.correct && <span className="mark">✓</span>}
                    {isDone && oi === chosen && oi !== item.correct && <span className="mark">✗</span>}
                  </button>
                )
              })}
              {isDone && (
                <div className={'q-fb ' + (chosen === item.correct ? 'ok' : 'no')}>
                  {chosen === item.correct ? '✓ ' + item.fb : 'לא מדויק. ' + item.fb}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <NavBar lockContinue={!allAnswered} hint={allAnswered ? undefined : 'ענו על שלוש השאלות כדי להמשיך'} />
    </>
  )
}

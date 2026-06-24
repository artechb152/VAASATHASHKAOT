import { useEffect, useState } from 'react'
import { QUIZ } from '../../data/content'
import { useSim } from '../../state/SimContext'
import NavBar from '../NavBar'

export default function MarketStep() {
  const { almaSequence, setAlmaPointing, requestReplay, markDone, almaSay } = useSim()
  const [answered, setAnswered] = useState<Record<number, number>>({})

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'ראיתם את הסרטון? מצוין.' },
      { html: 'עכשיו כמה שאלות קצרות כדי לוודא שהבנו את הבסיס. אל דאגה — זו לא בחינה.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  const allAnswered = Object.keys(answered).length === QUIZ.length

  function choose(qi: number, oi: number) {
    if (qi in answered) return
    const upd = { ...answered, [qi]: oi }
    setAnswered(upd)
    if (Object.keys(upd).length === QUIZ.length) {
      markDone()
      almaSay('יפה מאוד! קלטתם את הבסיס. עכשיו בואו נכיר מי בכלל משתתף בשוק ההון.', 'fb')
    }
  }

  return (
    <>
      <div className="card">
        <div className="kicker">שלב 2 · מהו שוק ההון</div>
        <h2>נראה מה נקלט</h2>
        <p className="lead">
          ראיתם את הסרטון על שוק ההון, הבורסה וניירות הערך. עכשיו כמה שאלות קצרות כדי לוודא שאנחנו על אותו
          הדף.
        </p>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => requestReplay(1)}>
          הצג שוב את הסרטון
        </button>
      </div>

      <div className="card">
        <div className="kicker">בדיקת ידע · {QUIZ.length} שאלות</div>
        <h3 style={{ fontSize: 22, marginBottom: 6 }}>שאלות קצרות</h3>
        {QUIZ.map((item, qi) => {
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

      <NavBar lockContinue={!allAnswered} hint={allAnswered ? undefined : 'ענו על כל השאלות כדי להמשיך'} />
    </>
  )
}

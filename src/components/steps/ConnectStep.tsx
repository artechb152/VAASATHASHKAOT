import { useEffect, useState } from 'react'
import { CONNECT_Q } from '../../data/content'
import { IconBank, IconBuilding, IconPerson } from '../../lib/icons'
import { useSim } from '../../state/SimContext'

export default function ConnectStep() {
  const { almaSequence, setAlmaPointing, markDone, almaSay, next, setBackHandler } = useSim()
  const [screen, setScreen] = useState<'intro' | number>('intro')
  const [answered, setAnswered] = useState<Record<number, number>>({})

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'עכשיו נחבר את כל החתיכות.' },
      { html: 'תסתכלו על הדיאגרמה: הכסף זורם מהמשקיע, דרך הבורסה, אל החברה או הממשלה.' },
      { html: 'ובתמורה? המשקיע מקבל בעלות, ריבית או תשואה. כשתהיו מוכנים — נענה על כמה שאלות.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  // Back goes one inner screen back (questions → … → intro → previous step).
  useEffect(() => {
    if (screen === 'intro') setBackHandler(null)
    else {
      const qi = screen
      setBackHandler(() => setScreen(qi === 0 ? 'intro' : qi - 1))
    }
    return () => setBackHandler(null)
  }, [screen, setBackHandler])

  function choose(qi: number, oi: number) {
    if (qi in answered) return
    const upd = { ...answered, [qi]: oi }
    setAnswered(upd)
    const correct = oi === CONNECT_Q[qi].correct
    if (Object.keys(upd).length === CONNECT_Q.length) {
      markDone()
      almaSay('יופי! הבנתם בדיוק איך הכסף זורם בשוק ההון.', 'fb')
    } else {
      almaSay(correct ? 'נכון מאוד.' : 'לא נורא — ככה לומדים. שימו לב להסבר.', correct ? 'fb' : 'tip')
    }
  }

  if (screen === 'intro') {
    return (
      <div className="card card-lg">
        <h2>מסע הכסף בשוק ההון</h2>
        <p className="lead" style={{ color: 'var(--on-surface)' }}>
          שוק ההון מחבר בין מי שיש לו כסף פנוי לבין מי שצריך כסף. חברות וממשלות מנפיקות מניות או אג״ח,
          המשקיעים קונים אותן, וכך הכסף עובר מהציבור אל הגופים — ובתמורה המשקיעים מקווים לתשואה.
        </p>

        <div className="flow-tri">
          <svg className="tri-arrows" viewBox="0 0 680 400" aria-hidden="true">
            <defs>
              <marker id="triArrow" markerWidth="7" markerHeight="7" refX="4.2" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7 Z" fill="currentColor" />
              </marker>
            </defs>
            {/* מפינת המשקיע אל פינת הבורסה — מרכז פינה למרכז פינה */}
            <path className="tri-arrow-path" d="M 470 232 L 447 173" markerEnd="url(#triArrow)" />
            {/* מפינת חברה/ממשלה אל פינת הבורסה */}
            <path className="tri-arrow-path" d="M 210 232 L 233 173" markerEnd="url(#triArrow)" />
          </svg>

          <div className="node mkt tri-top">
            <span className="ic"><IconBank /></span>
            <h4>הבורסה</h4>
            <p>מתווכת את העִסקה</p>
          </div>
          <div className="node inv tri-right">
            <span className="ic"><IconPerson /></span>
            <h4>המשקיע</h4>
            <p>נותן את הכסף</p>
          </div>
          <div className="node dst tri-left">
            <span className="ic"><IconBuilding /></span>
            <h4>חברה / ממשלה</h4>
            <p>מקבלת מימון</p>
          </div>
        </div>

        <div className="navbar">
          <button className="btn btn-primary btn-lg" onClick={() => setScreen(0)}>
            למעבר לשאלות
          </button>
        </div>
      </div>
    )
  }

  const qi = screen
  const item = CONNECT_Q[qi]
  const isDone = qi in answered
  const chosen = answered[qi]
  const isLast = qi === CONNECT_Q.length - 1

  return (
    <div className="quiz-card quiz-card-embed">
      <div className="quiz-anim" key={qi}>
        <h2 className="quiz-q">{item.q}</h2>

        <div className="quiz-opts">
          {item.opts.map((opt, oi) => {
            let cls = 'quiz-opt'
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
        </div>

        {isDone && (
          <div className={'q-fb ' + (chosen === item.correct ? 'ok' : 'no')}>
            {chosen === item.correct ? '✓ ' + item.fb : 'לא מדויק. ' + item.fb}
          </div>
        )}

        <button
          className="btn btn-primary btn-lg quiz-next"
          disabled={!isDone}
          onClick={() => (isLast ? next() : setScreen(qi + 1))}
        >
          {isLast ? 'סיום ומעבר לשלב הבא' : 'לשאלה הבאה'}
        </button>
      </div>
    </div>
  )
}

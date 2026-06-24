import { useEffect, useState } from 'react'
import { PARTS } from '../../data/content'
import { PartIcon } from '../../lib/icons'
import { shuffle } from '../../lib/utils'
import { useSim } from '../../state/SimContext'
import NavBar from '../NavBar'

export default function PartsStep() {
  const { almaSequence, setAlmaPointing, requestReplay, markDone, almaSay, showToast } = useSim()
  const [roles] = useState(() => shuffle(PARTS.map((p) => ({ id: p.id, text: p.short }))))
  const [selPart, setSelPart] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, boolean>>({})
  const [wrongId, setWrongId] = useState<string | null>(null)

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'הכרתם את המשתתפים בסרטון. כל אחד מגיע לשוק ההון מסיבה אחרת — חלקם להשקיע, וחלקם לגייס כסף.' },
      { html: 'בואו נשחק משחק קצר של התאמות כדי לוודא שהכול ברור.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  const allMatched = Object.keys(matched).length === PARTS.length

  function clickRole(roleId: string) {
    if (matched[roleId]) return
    if (!selPart) {
      showToast('קודם בחרו משתתף מימין')
      return
    }
    if (selPart === roleId) {
      const upd = { ...matched, [roleId]: true }
      setMatched(upd)
      setSelPart(null)
      if (Object.keys(upd).length === PARTS.length) {
        markDone()
        almaSay('מושלם! התאמתם את כולם נכון. עכשיו לחלק המעניין — ההבדל בין מניה לאג״ח.', 'fb')
      }
    } else {
      showToast('לא מתאים — נסו שוב')
      const w = selPart
      setSelPart(null)
      setWrongId(w)
      window.setTimeout(() => setWrongId((cur) => (cur === w ? null : cur)), 500)
    }
  }

  return (
    <>
      <div className="card">
        <div className="kicker">שלב 3 · מי משתתף בשוק ההון</div>
        <h2>בואו נכיר את הלקוחות שלנו</h2>
        <p className="lead">
          הכרתם את המשתתפים בסרטון. אלה הגופים שאיתם נעבוד — קראו שוב מי כל אחד ומה הוא עושה בשוק ההון.
        </p>
        <div className="part-grid" style={{ marginTop: 18 }}>
          {PARTS.map((p) => (
            <div className="part" key={p.id}>
              <span className="ic" aria-hidden="true">
                <PartIcon k={p.icon} />
              </span>
              <div>
                <h4>{p.name}</h4>
                <p>"{p.role}"</p>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={() => requestReplay(2)}>
          הצג שוב את הסרטון
        </button>
      </div>

      <div className="card">
        <div className="kicker">משימת התאמה</div>
        <h3 style={{ fontSize: 22, marginBottom: 4 }}>התאימו כל משתתף לתפקידו</h3>
        <p style={{ color: 'var(--on-variant)', fontSize: 15, margin: '0 0 16px' }}>
          בחרו משתתף מימין, ואז את התיאור המתאים לו משמאל.
        </p>
        <div className="match-cols">
          <div className="match-col">
            <h4>משתתפים</h4>
            {PARTS.map((p) => {
              const cls = 'chip' + (matched[p.id] ? ' matched' : selPart === p.id ? ' sel' : '')
              return (
                <button
                  key={p.id}
                  className={cls}
                  style={wrongId === p.id ? { borderColor: 'var(--error)' } : undefined}
                  disabled={!!matched[p.id]}
                  onClick={() => !matched[p.id] && setSelPart(p.id)}
                >
                  <span className="ic" aria-hidden="true">
                    <PartIcon k={p.icon} />
                  </span>
                  <span>{p.name}</span>
                </button>
              )
            })}
          </div>
          <div className="match-col">
            <h4>תפקידים</h4>
            {roles.map((r) => (
              <button
                key={r.id}
                className={'chip' + (matched[r.id] ? ' matched' : '')}
                disabled={!!matched[r.id]}
                onClick={() => clickRole(r.id)}
              >
                <span>{r.text}</span>
                {matched[r.id] && <span className="pair">✓ הותאם</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <NavBar lockContinue={!allMatched} hint={allMatched ? undefined : 'התאימו את כל המשתתפים כדי להמשיך'} />
    </>
  )
}

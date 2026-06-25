import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PARTS } from '../../data/content'
import { PartIcon } from '../../lib/icons'
import { asset, shuffle } from '../../lib/utils'
import { useSim } from '../../state/SimContext'

export default function PartsStep() {
  const { almaSequence, setAlmaPointing, markDone, almaSay, showToast, next, setBackHandler } = useSim()
  const [phase, setPhase] = useState<'intro' | 'match'>('intro')
  const [roles] = useState(() => shuffle(PARTS.map((p) => ({ id: p.id, text: p.short }))))
  const [selPart, setSelPart] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, boolean>>({})
  const [wrongId, setWrongId] = useState<string | null>(null)
  const [popup, setPopup] = useState<(typeof PARTS)[number] | null>(null)

  useEffect(() => {
    setAlmaPointing(true)
    if (phase === 'intro') {
      almaSequence([
        { html: 'הכרתם את המשתתפים בסרטון. כל אחד מגיע לשוק ההון מסיבה אחרת — חלקם להשקיע, וחלקם לגייס כסף.' },
        { html: 'קראו על כולם, וכשתהיו מוכנים נשחק משחק קצר של התאמות.', kind: 'tip' },
      ])
    } else {
      almaSequence([
        { html: 'עכשיו ההתאמה: בחרו משתתף מצד אחד, ואז את התיאור המתאים לו מהצד השני.', kind: 'tip' },
      ])
    }
  }, [phase, almaSequence, setAlmaPointing])

  useEffect(() => {
    setBackHandler(phase === 'match' ? () => setPhase('intro') : null)
    return () => setBackHandler(null)
  }, [phase, setBackHandler])

  const allMatched = Object.keys(matched).length === PARTS.length

  function clickRole(roleId: string) {
    if (matched[roleId]) return
    if (!selPart) {
      showToast('קודם בחרו משתתף')
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

  if (phase === 'intro') {
    return createPortal(
      <div className="divider-screen parts-screen">
        <video className="divider-bg" autoPlay muted loop playsInline>
          <source src={asset('media/opening.mp4')} type="video/mp4" />
        </video>
        <div className="divider-veil" />

        <div className="divider-content parts-intro">
          <div className="divider-avawrap">
            <img className="divider-ava" src={asset('media/alma.jpeg')} alt="אלמה" />
            <span className="divider-status" aria-hidden="true" />
          </div>
          <div className="divider-name">אלמה</div>
          <p className="divider-msg">
            בואו נכיר את הלקוחות שלנו — אלו הגופים שאיתם נעבוד. לחצו על כל אחד כדי לקרוא מי הוא ומה
            תפקידו, וכשתהיו מוכנים נשחק משחק התאמה קצר.
          </p>

          <div className="name-grid parts-names">
            {PARTS.map((p) => (
              <button className="name-card" key={p.id} onClick={() => setPopup(p)}>
                <img className="name-thumb" src={p.img} alt="" />
                <span className="nm">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="parts-actions">
            <button className="btn btn-primary" onClick={() => setPhase('match')}>
              למשחק ההתאמה
            </button>
          </div>
        </div>

        {popup && (
          <div className="pop-overlay" onClick={() => setPopup(null)}>
            <div className="pop-card" onClick={(e) => e.stopPropagation()}>
              <button className="pop-close" onClick={() => setPopup(null)} aria-label="סגירה">
                ✕
              </button>
              <img className="pop-photo" src={popup.img} alt="" />
              <h3>{popup.name}</h3>
              <p>{popup.role}</p>
            </div>
          </div>
        )}
      </div>,
      document.body,
    )
  }

  return (
    <div className="card">
      <h2>התאימו כל משתתף לתפקידו</h2>
      <p className="lead">בחרו משתתף מצד אחד, ואז את התיאור המתאים לו מהצד השני.</p>

      <div className="match-cols" style={{ marginTop: 18 }}>
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
              <span className="pair">{matched[r.id] ? '✓ הותאם' : ''}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="navbar">
        <button className="btn btn-primary" disabled={!allMatched} onClick={next}>
          המשך לשלב הבא
        </button>
      </div>
    </div>
  )
}

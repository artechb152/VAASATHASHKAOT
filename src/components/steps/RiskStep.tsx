import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { RANK } from '../../data/content'
import { asset, shuffle } from '../../lib/utils'
import { useSim } from '../../state/SimContext'

type Status = 'idle' | 'wrong' | 'solved'

export default function RiskStep() {
  const { almaSequence, setAlmaPointing, markDone, almaSay, next, setBackHandler } = useSim()
  const [screen, setScreen] = useState<'intro' | 'rank'>('intro')
  const [order, setOrder] = useState(() => shuffle(RANK))
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'הגענו לאחד הנושאים הכי חשובים: <b>הקשר בין סיכון לתשואה</b>.' },
      { html: 'הכלל הבסיסי: יותר סיכון ← פוטנציאל לרווח גבוה יותר, אבל גם סיכוי גדול יותר להפסד.' },
      { html: 'יש לי שלוש השקעות. סדרו אותן מהבטוחה למסוכנת — ונראה אם תפסתם את ההיגיון.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  useEffect(() => {
    setBackHandler(screen === 'rank' ? () => setScreen('intro') : null)
    return () => setBackHandler(null)
  }, [screen, setBackHandler])

  function move(idx: number, dir: -1 | 1) {
    if (status === 'solved') return
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    const nextOrder = order.slice()
    ;[nextOrder[idx], nextOrder[j]] = [nextOrder[j], nextOrder[idx]]
    setOrder(nextOrder)
    setStatus('idle')
  }

  function check() {
    const correct = order.every((it, i) => it.rank === i)
    if (correct) {
      setStatus('solved')
      markDone()
      almaSay('בול! זה בדיוק הקשר בין סיכון לתשואה — ראיתם איך הם הולכים יד ביד.', 'fb')
    } else {
      setStatus('wrong')
      window.setTimeout(() => setStatus((s) => (s === 'wrong' ? 'idle' : s)), 1400)
    }
  }

  if (screen === 'intro') {
    return createPortal(
      <div className="divider-screen">
        <video className="divider-bg" autoPlay muted loop playsInline>
          <source src={asset('media/opening.mp4')} type="video/mp4" />
        </video>
        <div className="divider-veil" />

        <div className="divider-content risk-intro">
          <div className="divider-avawrap">
            <img className="divider-ava" src={asset('media/alma.jpeg')} alt="אלמה" />
            <span className="divider-status" aria-hidden="true" />
          </div>
          <div className="divider-name">אלמה</div>
          <p className="divider-msg">
            הגענו לאחד הנושאים החשובים ביותר בשוק ההון — הקשר בין <b>סיכון</b> ל<b>תשואה</b>. הכלל פשוט: ככל
            שההשקעה מסוכנת יותר, פוטנציאל הרווח גבוה יותר — אבל גם הסיכוי להפסד. השקעה יציבה תיתן בדרך כלל
            תשואה צנועה יותר, אך בטוחה ויציבה.
          </p>
          <button
            className="btn btn-primary btn-lg"
            style={{ fontSize: 18, padding: '15px 40px' }}
            onClick={() => setScreen('rank')}
          >
            למשימת הדירוג
          </button>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div className="card rank-card">
      <h2>סדרו מהבטוח למסוכן</h2>
      <p className="lead">השתמשו בחיצים כדי לדרג את שלוש ההשקעות: למעלה = הכי בטוח, למטה = הכי מסוכן.</p>

      <div className="rank-list" style={{ marginTop: 18 }}>
        {order.map((it, idx) => {
          let cls = 'rank-item'
          if (status === 'solved') cls += ' ok'
          else if (status === 'wrong') cls += it.rank === idx ? ' ok' : ' bad'
          return (
            <div className={cls} key={it.id}>
              <span className="pos mono">{idx + 1}</span>
              <div className="txt">
                <h4>{it.name}</h4>
                <p>{it.desc}</p>
              </div>
              <div className="rank-btns">
                <button onClick={() => move(idx, -1)} disabled={idx === 0 || status === 'solved'} title="למעלה">
                  ▲
                </button>
                <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1 || status === 'solved'} title="למטה">
                  ▼
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rank-fb-slot">
        {status === 'solved' ? (
          <div className="q-fb ok">
            ✓ מדויק! אג״ח ממשלתי הוא הבטוח ביותר (תשואה נמוכה ויציבה), התיק המעורב באמצע, ומניה בודדת היא
            המסוכנת ביותר (אבל עם פוטנציאל הרווח הגבוה ביותר).
          </div>
        ) : status === 'wrong' ? (
          <div className="q-fb no">
            כמעט. זכרו: ככל שההשקעה תלויה בגורם אחד (כמו מניה בודדת) — היא מסוכנת יותר. אג״ח ממשלתי הוא
            היציב ביותר. סדרו שוב ונסו.
          </div>
        ) : (
          <div className="rank-hint">סדרו את שלוש ההשקעות מהבטוחה למסוכנת, ואז לחצו על "בדיקת הדירוג".</div>
        )}
      </div>

      <div className="navbar">
        {status !== 'solved' ? (
          <button className="btn btn-primary" onClick={check}>
            בדיקת הדירוג
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            המשך לשלב הבא
          </button>
        )}
      </div>
    </div>
  )
}

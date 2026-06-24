import { useEffect, useState } from 'react'
import { RANK } from '../../data/content'
import { shuffle } from '../../lib/utils'
import { useSim } from '../../state/SimContext'
import NavBar from '../NavBar'

type Status = 'idle' | 'wrong' | 'solved'

export default function RiskStep() {
  const { almaSequence, setAlmaPointing, markDone, almaSay } = useSim()
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

  function move(idx: number, dir: -1 | 1) {
    if (status === 'solved') return
    const j = idx + dir
    if (j < 0 || j >= order.length) return
    const next = order.slice()
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setOrder(next)
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

  return (
    <>
      <div className="card">
        <div className="kicker">שלב 6 · סיכון מול תשואה</div>
        <h2>ככל שמסתכנים יותר…</h2>
        <p className="lead">
          בשוק ההון יש קשר ישיר בין סיכון לתשואה: ככל שההשקעה מסוכנת יותר, פוטנציאל הרווח גבוה יותר — אבל גם
          הסיכוי להפסד. השקעה יציבה תציע בדרך כלל תשואה נמוכה יותר.
        </p>
        <div className="hr" />
        <h3 style={{ fontSize: 20, marginBottom: 6 }}>סדרו מהבטוח למסוכן</h3>
        <p style={{ color: 'var(--on-variant)', fontSize: 15, margin: '0 0 16px' }}>
          השתמשו בחיצים כדי לדרג: למעלה = הכי בטוח, למטה = הכי מסוכן.
        </p>

        <div className="rank-list">
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

        {status !== 'solved' && (
          <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={check}>
            בדיקת הדירוג ✓
          </button>
        )}
        {status === 'solved' && (
          <div className="q-fb ok" style={{ marginTop: 14 }}>
            ✓ מדויק! אג״ח ממשלתי הוא הבטוח ביותר (תשואה נמוכה ויציבה), התיק המעורב באמצע, ומניה בודדת היא
            המסוכנת ביותר (אבל עם פוטנציאל הרווח הגבוה ביותר).
          </div>
        )}
        {status === 'wrong' && (
          <div className="q-fb no" style={{ marginTop: 14 }}>
            כמעט. זכרו: ככל שההשקעה תלויה בגורם אחד (כמו מניה בודדת) — היא מסוכנת יותר. אג״ח ממשלתי הוא היציב
            ביותר. סדרו שוב ונסו.
          </div>
        )}
      </div>

      <NavBar lockContinue={status !== 'solved'} hint={status === 'solved' ? undefined : 'דרגו נכון כדי להמשיך'} />
    </>
  )
}

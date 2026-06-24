import { useEffect, useMemo, useState } from 'react'
import { FOLIO } from '../../data/content'
import { fmt, profitLabel, riskLabel } from '../../lib/utils'
import { useSim } from '../../state/SimContext'
import NavBar from '../NavBar'

interface Result {
  verdict: string
  vcls: 'risky' | 'safe' | 'balanced'
  lines: string[]
}

export default function FolioStep() {
  const { almaSequence, setAlmaPointing, setMeters, setPortfolio, markDone, almaSay } = useSim()
  const [vals, setVals] = useState<Record<string, number>>({ bond: 34, mix: 33, stock: 33 })
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'הגיע הרגע להרכיב תיק אמיתי מהתקציב המלא של מיליון השקלים.' },
      { html: 'אין כאן תשובה אחת "נכונה". השאלה היא איזה איזון מתאים לכם — בטוח, מסוכן, או משהו באמצע.' },
      { html: 'גררו את הסליידרים כך שסך הכול יהיה 100%, ואז אאשר ואתן לכם ניתוח מלא.', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  const total = useMemo(() => FOLIO.reduce((s, f) => s + (vals[f.id] || 0), 0), [vals])

  function submit() {
    const risk = FOLIO.reduce((s, f) => s + vals[f.id] * f.riskW, 0) / 100
    const ret = FOLIO.reduce((s, f) => s + vals[f.id] * f.retW, 0) / 100
    setMeters(risk, ret, true)
    setPortfolio({ ...vals })

    let verdict: string
    let vcls: Result['vcls']
    if (vals.stock >= 60) {
      verdict = 'תיק אגרסיבי'
      vcls = 'risky'
    } else if (vals.bond >= 70) {
      verdict = 'תיק שמרני מאוד'
      vcls = 'safe'
    } else {
      verdict = 'תיק מאוזן'
      vcls = 'balanced'
    }

    const lines: string[] = [
      `<b>רמת הסיכון הכללית:</b> ${riskLabel(risk)} (${Math.round(risk)}%).`,
      `<b>פוטנציאל התשואה:</b> ${profitLabel(ret)} (${Math.round(ret)}%).`,
    ]
    if (vcls === 'risky')
      lines.push('התיק נשען בעיקר על מניה בודדת — פוטנציאל הרווח גבוה, אך גם הסיכון להפסד. שווה לשקול לפזר יותר.')
    else if (vcls === 'safe')
      lines.push('התיק בטוח מאוד ויציב, אך פוטנציאל הרווח מוגבל. מעט יותר חשיפה לצמיחה יכלה להעלות את התשואה.')
    else lines.push('התיק מפזר את הכסף בין רכיבים בטוחים למסוכנים — איזון יפה בין יציבות לפוטנציאל צמיחה.')
    lines.push(
      '<b>מה זה מלמד?</b> כך בדיוק עובד שוק ההון: ניירות ערך שונים (מניות ואג״ח) נושאים רמות סיכון ותשואה שונות, ובחירת התמהיל היא שמגדירה את פרופיל הסיכון–תשואה של התיק.',
    )

    setResult({ verdict, vcls, lines })
    markDone()
    almaSay(
      `קיבלתי את התיק שלכם! <b>${verdict}</b> — רמת סיכון ${riskLabel(risk).replace('סיכון ', '')} ופוטנציאל תשואה ${profitLabel(ret).replace('פוטנציאל ', '')}. ניתוח מלא מופיע במסך לצידכם.`,
      'fb',
    )
  }

  const sumCls = 'alloc-sum' + (total === 100 ? ' ok' : total > 100 ? ' over' : '')
  const sumText =
    total === 100 ? '100% / 100% ✓' : total > 100 ? `${total}% / 100% — חרגתם` : `${total}% / 100% — נותרו ${100 - total}%`

  return (
    <>
      <div className="card">
        <div className="kicker">שלב 7 · משימת הסיכום</div>
        <h2>בנו את תיק ההשקעות שלכם</h2>
        <p className="lead">
          זה הרגע. חלקו את מלוא התקציב — <b className="mono">₪1,000,000</b> — בין שלוש האפשרויות. אין תשובה
          אחת נכונה; השאלה היא איזה איזון בין סיכון לתשואה מתאים לכם. סך ההקצאה חייב להגיע ל-100%.
        </p>
        <div className="hr" />

        <div className="alloc">
          {FOLIO.map((f) => (
            <div className="alloc-row" key={f.id}>
              <div className="top">
                <span className="nm">
                  {f.name} <span className={'badge ' + f.badgeCls}>{f.badge}</span>
                </span>
                <span className="amt mono">
                  {vals[f.id]}% · {fmt(vals[f.id] * 10000)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={vals[f.id]}
                disabled={!!result}
                onChange={(e) => setVals((v) => ({ ...v, [f.id]: +e.target.value }))}
                aria-label={f.name}
              />
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className={sumCls}>
          <span>סך ההקצאה</span>
          <span className="rem">{sumText}</span>
        </div>

        {!result ? (
          <button className="btn btn-buy" style={{ marginTop: 18 }} disabled={total !== 100} onClick={submit}>
            לאשר את התיק ולקבל ניתוח ◂
          </button>
        ) : (
          <div className="summary-box">
            <span className={'verdict ' + result.vcls}>{result.verdict}</span>
            <h4>ניתוח התיק שלכם</h4>
            <ul>
              {result.lines.map((l, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: l }} />
              ))}
            </ul>
          </div>
        )}
      </div>

      <NavBar lockContinue={!result} hint={result ? undefined : 'אשרו תיק תקין (100%) כדי להמשיך'} />
    </>
  )
}

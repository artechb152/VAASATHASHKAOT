import { useEffect, useState } from 'react'
import { asset, BASE } from '../../lib/utils'
import type { Trade } from '../../types'
import { useSim } from '../../state/SimContext'

export default function TradeStep() {
  const { almaSequence, setAlmaPointing, setMeters, setTrade, markDone, almaSay } = useSim()
  const [chosen, setChosen] = useState<Trade | null>(null)

  useEffect(() => {
    setAlmaPointing(true)
    almaSequence([
      { html: 'סומכת עליכם שתדעו לבחור מה מתאים יותר — ולעזרה, אני ממש פה לצידכם!', kind: 'tip' },
    ])
  }, [almaSequence, setAlmaPointing])

  function feedback(pick: Trade) {
    const isStock = pick === 'stock'
    const html =
      '<b>משוב על ההחלטה</b>' +
      `<span class="fb-row"><b>מה בחרת?</b> ${isStock ? 'להשקיע ב<b>מניה</b> של PROCKEN.' : 'לרכוש <b>אג״ח ממשלתי</b>.'}</span>` +
      `<span class="fb-row"><b>מה המשמעות?</b> ${isStock ? 'הפכת לשותף קטן בחברה. אם תצליח — תרוויח; אם תיכשל — אתה עלול להפסיד.' : 'הלווית כסף למדינה, והיא מתחייבת להחזיר אותו בתוספת ריבית.'}</span>` +
      `<span class="fb-row"><b>מה קרה למדדים?</b> ${isStock ? 'מד הסיכון עלה <b>בחדות</b>, וגם מד פוטנציאל התשואה עלה <b>בחדות</b>.' : 'מד הסיכון עלה <b>מעט</b>, וגם מד פוטנציאל התשואה עלה <b>מעט</b>.'}</span>` +
      `<span class="fb-row"><b>מה הקשר לשוק ההון?</b> כך שוק ההון מחבר בין משקיעים (אתה) לבין גופים שזקוקים למימון (${isStock ? 'חברה' : 'מדינה'}).</span>` +
      `<span class="fb-row" style="opacity:.85"><b>ומה היה קורה אחרת?</b> ${isStock ? 'אם היית בוחר באג״ח — הסיכון והתשואה היו עולים הרבה פחות, אבל ההשקעה הייתה יציבה ובטוחה יותר.' : 'אם היית בוחר במניה — הסיכון היה עולה הרבה יותר, אך גם פוטנציאל הרווח היה גבוה בהרבה.'}</span>`
    almaSay(html, 'fb')
  }

  function choose(pick: Trade) {
    setChosen(pick)
    setTrade(pick)
    if (pick === 'stock') setMeters(BASE + 35, BASE + 35, true)
    else setMeters(BASE + 10, BASE + 12, true)
    markDone()
    feedback(pick)
  }

  function changeChoice() {
    setChosen(null)
    setTrade(null)
    setMeters(BASE, BASE, false)
  }

  return (
    <>
      <div className="card">
        <h2>שני לקוחות, שתי הצעות</h2>
        <p className="lead">
          הגיעו אליכם שני לקוחות. אחד מציע לכם לקנות <b>מניה</b>, השני מציע <b>אג״ח ממשלתי</b>. השקיעו ₪1,000
          לתרגול — בחרו במי שמתאים לכם, וצפו כיצד מדי הסיכון והתשואה מגיבים.
        </p>

        <div className="pitch-grid" style={{ marginTop: 18 }}>
          <div className={'pitch' + (chosen === 'stock' ? ' chosen' : chosen ? ' dimmed' : '')}>
            <img src={asset('media/shimon.jpeg')} alt="שמעון, מנכ״ל PROCKEN" />
            <div className="body">
              <div className="who">
                <span className="tag stock">מניה</span>
              </div>
              <h4>שמעון</h4>
              <div className="role">מנכ״ל חברת PROCKEN</div>
              <div className="quote">
                "אם תקנו מניה בחברה שלי, אתם הופכים לשותפים קטנים. אם נצליח — ערך המניה יכול לעלות. אבל אם
                ניכשל — אתם עלולים להפסיד."
              </div>
              <div className="metaline">
                <span className="up">סיכון גבוה יותר</span>
                <span className="gr">פוטנציאל רווח גבוה יותר</span>
              </div>
              <button className="btn btn-primary choose" disabled={!!chosen} onClick={() => choose('stock')}>
                לרכוש מניה · ₪1,000
              </button>
            </div>
          </div>

          <div className={'pitch' + (chosen === 'bond' ? ' chosen' : chosen ? ' dimmed' : '')}>
            <img src={asset('media/cohen.jpeg')} alt="מר כהן, נציג הממשלה" />
            <div className="body">
              <div className="who">
                <span className="tag bond">אג״ח</span>
              </div>
              <h4>מר כהן</h4>
              <div className="role">נציג הממשלה</div>
              <div className="quote">
                "אם תרכשו אג״ח ממשלתי, אתם בעצם מלווים כסף למדינה. המדינה מתחייבת להחזיר את הכסף עם ריבית.
                הסיכון בדרך כלל נמוך יותר, אבל גם פוטנציאל הרווח נמוך יותר."
              </div>
              <div className="metaline">
                <span className="up">סיכון נמוך יותר</span>
                <span className="gr">פוטנציאל רווח נמוך יותר</span>
              </div>
              <button className="btn btn-primary choose" disabled={!!chosen} onClick={() => choose('bond')}>
                לרכוש אג״ח · ₪1,000
              </button>
            </div>
          </div>
        </div>

        {chosen && (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={changeChoice}>
            לשנות בחירה
          </button>
        )}
      </div>
    </>
  )
}

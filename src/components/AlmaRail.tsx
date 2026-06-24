import { useEffect, useRef } from 'react'
import { asset, nowStr } from '../lib/utils'
import { IconInfo } from '../lib/icons'
import { useSim } from '../state/SimContext'

export default function AlmaRail() {
  const { messages, almaPointing } = useSim()
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <aside className="alma-rail" aria-label="עלמה — יועצת">
      <div className="alma-top">
        <img
          className="alma-ava"
          src={asset(almaPointing ? 'media/alma-pointing.jpeg' : 'media/alma.jpeg')}
          alt="עלמה, היועצת הדיגיטלית"
        />
        <div className="alma-id">
          <div className="nm">
            עלמה <span className="dot" aria-hidden="true" />
          </div>
          <div className="rl">יועצת הוועדה · מקוונת</div>
        </div>
      </div>

      <div className="alma-thread" ref={threadRef}>
        {messages.map((m, i) => (
          <div key={i} className={'bubble ' + (m.kind || 'alma')} style={{ animationDelay: `${i * 0.06}s` }}>
            <span dangerouslySetInnerHTML={{ __html: m.html }} />
            <span className="time">עלמה · {nowStr()}</span>
          </div>
        ))}
      </div>

      <div className="alma-foot">
        <IconInfo /> עלמה כאן לצידכם לאורך כל הדרך
      </div>
    </aside>
  )
}

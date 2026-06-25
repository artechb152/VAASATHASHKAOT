import { useEffect, useRef, useState } from 'react'
import { asset, nowStr } from '../lib/utils'
import { useSim } from '../state/SimContext'

// Floating Alma chat — same style as the dialog/quiz screens, top-left.
export default function AlmaRail() {
  const { messages } = useSim()
  const [open, setOpen] = useState(false)
  const [hasNew, setHasNew] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setHasNew(true)
  }, [messages])

  useEffect(() => {
    if (open) {
      setHasNew(false)
      const e = bodyRef.current
      if (e) e.scrollTop = e.scrollHeight
    }
  }, [open, messages])

  if (!open) {
    return (
      <>
        <button
          className={'qchat-fab' + (hasNew ? ' pulse' : '')}
          onClick={() => setOpen(true)}
          aria-label="פתיחת הצ׳אט עם אלמה"
        >
          <img src={asset('media/alma.jpeg')} alt="" />
          {hasNew && <span className="qchat-badge" aria-hidden="true" />}
        </button>
        <div className="qchat-label">{hasNew ? 'הודעה חדשה מאלמה' : 'הצ׳אט עם אלמה'}</div>
      </>
    )
  }

  return (
    <div className="qchat-panel">
      <div className="qchat-head">
        <img src={asset('media/alma.jpeg')} alt="אלמה" />
        <span>אלמה</span>
        <button className="qchat-close" onClick={() => setOpen(false)} aria-label="סגירת הצ׳אט">
          ✕
        </button>
      </div>
      <div className="qchat-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="qchat-empty">אלמה כאן לצידכם לאורך כל הדרך.</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={'bubble ' + (m.kind || 'alma')}>
              <span dangerouslySetInnerHTML={{ __html: m.html }} />
              <span className="time">אלמה · {nowStr()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { asset } from '../lib/utils'
import { QUIZ } from '../data/content'

interface ChatMsg {
  html: string
  ok: boolean
}

export default function QuizDialog({
  onComplete,
  onReplayVideo,
}: {
  onComplete: () => void
  onReplayVideo: () => void
}) {
  const [qi, setQi] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  const item = QUIZ[qi]
  const isLast = qi === QUIZ.length - 1
  const answered = chosen !== null

  function choose(oi: number) {
    if (answered) return
    setChosen(oi)
    const ok = oi === item.correct
    const fbText = ok ? item.fb : 'לא מדויק. ' + item.fb
    setChat((c) => [...c, { html: `<b>שאלה ${qi + 1}.</b> ${fbText}`, ok }])
    if (!chatOpen) setUnread((u) => u + 1)
  }

  function nextQ() {
    if (isLast) {
      setShowFeedback(true)
      return
    }
    setQi((i) => i + 1)
    setChosen(null)
  }

  function toggleChat() {
    setChatOpen((o) => {
      if (!o) setUnread(0)
      return !o
    })
  }

  function restart() {
    setQi(0)
    setChosen(null)
    setChat([])
    setUnread(0)
    setChatOpen(false)
    setShowFeedback(false)
  }

  const correct = chat.filter((m) => m.ok).length
  const total = QUIZ.length
  const verdict =
    correct === total
      ? 'מצוין — שליטה מלאה בבסיס!'
      : correct >= total - 1
        ? 'כמעט מושלם, הבסיס ברור לכם.'
        : 'יפה — תפסתם את הרעיון המרכזי.'
  const passed = correct >= 2 // need at least 2 of 4 to continue

  return (
    <div className="quiz-screen">
      <video className="divider-bg" autoPlay muted loop playsInline>
        <source src={asset('media/opening.mp4')} type="video/mp4" />
      </video>
      <div className="divider-veil" />

      {!showFeedback && (
        <button className="quiz-replay" onClick={onReplayVideo}>
          חזרה לסרטון
        </button>
      )}

      {showFeedback ? (
        <div className="quiz-card feedback-card">
          <div className="divider-avawrap">
            <img className="divider-ava" src={asset('media/alma.jpeg')} alt="אלמה" />
            <span className="divider-status" aria-hidden="true" />
          </div>
          <div className="divider-name">אלמה</div>
          <div className="quiz-score">
            {correct}/{total}
          </div>
          <p className="quiz-score-sub">ענית נכון על {correct} מתוך {total} שאלות</p>
          {passed ? (
            <>
              <p className="divider-msg" style={{ fontSize: 20, marginBottom: 28 }}>
                {verdict} אפשר לעבור לחלק המעניין — מי משתתף בשוק ההון.
              </p>
              <button className="btn btn-primary btn-lg quiz-next" onClick={onComplete}>
                המשך לשלב הבא
              </button>
            </>
          ) : (
            <>
              <p className="divider-msg" style={{ fontSize: 20, marginBottom: 28 }}>
                אין בעיה — ככה לומדים. בואו נחזור על השאלות יחד, ואני בטוחה שהפעם זה ילך חלק.
              </p>
              <button className="btn btn-primary btn-lg quiz-next" onClick={restart}>
                חזרה על השאלות
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="quiz-card">
          <div className="quiz-anim" key={qi}>
            <h2 className="quiz-q">{item.q}</h2>

            <div className="quiz-opts">
              {item.opts.map((opt, oi) => {
                let cls = 'quiz-opt'
                if (answered && oi === item.correct) cls += ' correct'
                else if (answered && oi === chosen) cls += ' wrong'
                return (
                  <button key={oi} className={cls} disabled={answered} onClick={() => choose(oi)}>
                    {opt}
                    {answered && oi === item.correct && <span className="mark">✓</span>}
                    {answered && oi === chosen && oi !== item.correct && <span className="mark">✗</span>}
                  </button>
                )
              })}
            </div>

            {answered && (
              <button className="btn btn-primary btn-lg quiz-next" onClick={nextQ}>
                {isLast ? 'לסיכום' : 'לשאלה הבאה'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Alma chat */}
      {chatOpen && (
        <div className="qchat-panel">
          <div className="qchat-head">
            <img src={asset('media/alma.jpeg')} alt="אלמה" />
            <span>אלמה</span>
            <button className="qchat-close" onClick={toggleChat} aria-label="סגירה">
              ✕
            </button>
          </div>
          <div className="qchat-body">
            {chat.length === 0 ? (
              <div className="qchat-empty">כאן יופיעו ההערות שלי על כל תשובה שתבחרו.</div>
            ) : (
              chat.map((m, i) => (
                <div
                  key={i}
                  className={'qchat-msg ' + (m.ok ? 'ok' : 'no')}
                  dangerouslySetInnerHTML={{ __html: m.html }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {!chatOpen && (
        <div className="qchat-label">{unread > 0 ? 'הודעה חדשה מאלמה' : 'ההערות של אלמה'}</div>
      )}
      <button
        className={'qchat-fab' + (unread > 0 ? ' pulse' : '')}
        onClick={toggleChat}
        aria-label="הודעות מאלמה"
      >
        <img src={asset('media/alma.jpeg')} alt="" />
        {unread > 0 && <span className="qchat-badge">{unread}</span>}
      </button>
    </div>
  )
}

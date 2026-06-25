import { useEffect } from 'react'
import { useSim } from '../../state/SimContext'

export default function IntroStep() {
  const { clearThread, setAlmaPointing, requestReplay } = useSim()

  useEffect(() => {
    setAlmaPointing(false)
    clearThread()
  }, [clearThread, setAlmaPointing])

  return (
    <div className="card">
      <h2>היכרות עם אלמה</h2>
      <p className="lead">
        צפו בהיכרות עם אלמה, היועצת הדיגיטלית של הוועדה, ולחצו על המטבע כדי להיכנס לתפקיד ולקבל תקציב של
        מיליון ש״ח.
      </p>
      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => requestReplay(0)}>
        הצג שוב את ההיכרות
      </button>
    </div>
  )
}

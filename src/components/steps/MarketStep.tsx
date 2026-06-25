import { useEffect } from 'react'
import { useSim } from '../../state/SimContext'

// The "מהו שוק ההון" quiz is rendered as a full-screen dialog at the App level
// (see QuizDialog). This step component only clears the side chat thread.
export default function MarketStep() {
  const { clearThread } = useSim()

  useEffect(() => {
    clearThread()
  }, [clearThread])

  return null
}

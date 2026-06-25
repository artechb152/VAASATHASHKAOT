import type { ReactNode } from 'react'
import { asset } from './lib/utils'
import AlmaRail from './components/AlmaRail'
import MetricsHud from './components/MetricsHud'
import Opening from './components/Opening'
import VideoOverlay from './components/VideoOverlay'
import ProtocolDivider from './components/ProtocolDivider'
import QuizDialog from './components/QuizDialog'
import { STEP_VIDEO } from './data/content'
import { useSim } from './state/SimContext'
import IntroStep from './components/steps/IntroStep'
import MarketStep from './components/steps/MarketStep'
import PartsStep from './components/steps/PartsStep'
import TradeStep from './components/steps/TradeStep'
import ConnectStep from './components/steps/ConnectStep'
import RiskStep from './components/steps/RiskStep'
import FolioStep from './components/steps/FolioStep'
import EndStep from './components/steps/EndStep'

const STEP_COMPONENTS = [
  IntroStep,
  MarketStep,
  PartsStep,
  TradeStep,
  ConnectStep,
  RiskStep,
  FolioStep,
  EndStep,
]

export default function App() {
  const sim = useSim()

  if (!sim.started) return <Opening />

  const StepCmp = STEP_COMPONENTS[sim.step]

  const autoCfg = STEP_VIDEO[sim.step]
  const autoShow = !!autoCfg && !sim.videoSeen[sim.step]
  const replayCfg = sim.replay != null ? STEP_VIDEO[sim.replay] : null

  // Separator screens for the "מהו שוק ההון" stage (step 1):
  // before the video, again after the video, then the quiz itself.
  const showProtocol = sim.step === 1 && !sim.protocolSeen
  const showQuizGate = sim.step === 1 && sim.videoSeen[1] && !sim.quizGateSeen
  const showQuiz = sim.step === 1 && sim.videoSeen[1] && sim.quizGateSeen

  // Stage 4 (trade) separator screens: intro before, feedback after the choice.
  const tradeChoice = sim.decisions.trade
  const showTradeIntro = sim.step === 3 && !sim.tradeIntroSeen
  const showTradeFeedback = sim.step === 3 && tradeChoice != null && !sim.tradeFeedbackSeen
  const showTradeAlt =
    sim.step === 3 && tradeChoice != null && sim.tradeFeedbackSeen && !sim.tradeAltSeen

  function autoVideoDone() {
    // The intro video (step 0) enters the role and advances; every other video
    // just marks itself seen so the step's own flow (quiz gate, etc.) continues.
    if (sim.step === 0) {
      sim.markDone()
      sim.next()
    } else {
      sim.setVideoSeen(sim.step)
    }
  }

  // Primary full-screen layer for the current step (mutually exclusive).
  let primary: ReactNode = null
  if (showProtocol) {
    primary = (
      <ProtocolDivider
        message="רגע לפני שנמשיך — לפי הנהלים אני צריכה שתצפו בסרטון הבא ותענו על כמה שאלות קצרות."
        onContinue={sim.setProtocolSeen}
      />
    )
  } else if (autoShow) {
    primary = <VideoOverlay key={'auto-' + sim.step} cfg={autoCfg} onDone={autoVideoDone} />
  } else if (showQuizGate) {
    primary = (
      <ProtocolDivider
        message="יופי, ראיתם את הסרטון! עכשיו כמה שאלות קצרות כדי לוודא שהבנו את הבסיס — ונמשיך הלאה."
        buttonLabel="לשאלות"
        onContinue={sim.setQuizGateSeen}
      />
    )
  } else if (showQuiz) {
    primary = (
      <QuizDialog
        onComplete={() => {
          sim.markDone()
          sim.next()
        }}
        onReplayVideo={() => sim.requestReplay(1)}
      />
    )
  } else if (showTradeIntro) {
    primary = (
      <ProtocolDivider
        message="<b>ניירות ערך</b> הם שם כללי למסמכים פיננסיים שנסחרים בשוק ההון — ביניהם מניות ואג״ח. עכשיו יגיעו אליכם שני לקוחות: אחד מציע מניה, השני אג״ח ממשלתי. בחרו מה שמתאים, ואני ממש פה לצידכם."
        buttonLabel="קדימה, בואו נכיר"
        onContinue={sim.setTradeIntroSeen}
      />
    )
  } else if (showTradeFeedback) {
    primary = (
      <ProtocolDivider
        message={
          tradeChoice === 'stock'
            ? 'בחרתם להשקיע ב<b>מניה</b> של PROCKEN — הפכתם לשותפים קטנים בחברה. אם תצליחו, ערך המניה יעלה; אם תיכשלו, אתם עלולים להפסיד. לכן מד הסיכון <b>ופוטנציאל התשואה קפצו שניהם בחדות</b>. כך שוק ההון מחבר ביניכם, המשקיעים, לבין חברה שזקוקה למימון.'
            : 'בחרתם לרכוש <b>אג״ח ממשלתי</b> — הלוויתם כסף למדינה, והיא מתחייבת להחזיר אותו בתוספת ריבית. זו השקעה יציבה יחסית, ולכן מד הסיכון <b>ופוטנציאל התשואה עלו רק במעט</b>. כך שוק ההון מחבר ביניכם, המשקיעים, לבין המדינה שזקוקה למימון.'
        }
        buttonLabel="ומה היה קורה אחרת?"
        onContinue={sim.setTradeFeedbackSeen}
      />
    )
  } else if (showTradeAlt) {
    primary = (
      <ProtocolDivider
        message={
          tradeChoice === 'stock'
            ? 'ומה היה קורה אילו הייתם בוחרים ב<b>אג״ח ממשלתי</b> במקום במניה? הייתם מלווים כסף למדינה, שמתחייבת להחזיר אותו בתוספת ריבית. הסיכון היה עולה הרבה פחות — אבל גם פוטנציאל הרווח היה נמוך יותר. כלומר, בחירה יציבה ובטוחה יותר, עם פחות הפתעות.'
            : 'ומה היה קורה אילו הייתם בוחרים ב<b>מניה</b> של PROCKEN במקום באג״ח? הייתם הופכים לשותפים בחברה. הסיכון היה עולה הרבה יותר — אבל גם פוטנציאל הרווח היה גבוה בהרבה. כלומר, בחירה נועזת יותר, עם סיכוי גדול יותר לרווח, אך גם להפסד.'
        }
        buttonLabel="ממשיכים לשלב הבא"
        onContinue={() => {
          sim.setTradeAltSeen()
          sim.next()
        }}
      />
    )
  }

  return (
    <div id="app">
      <video className="app-bg" autoPlay muted loop playsInline>
        <source src={asset('media/opening.mp4')} type="video/mp4" />
      </video>
      <div className="app-bg-veil" />

      <div className="layout">
        <main className="stage" key={sim.step}>
          <StepCmp />
        </main>
      </div>
      {primary === null && replayCfg == null && <AlmaRail />}
      {primary === null && replayCfg == null && sim.step >= 3 && <MetricsHud />}

      {/* Consistent top-right back button on in-layout stages (from stage 3) */}
      {primary === null && replayCfg == null && sim.step >= 2 && (
        <button
          className="backbtn"
          onClick={() => (sim.backHandler ? sim.backHandler() : sim.back())}
          aria-label="חזרה לשלב הקודם"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          חזרה
        </button>
      )}

      {primary}

      {/* Replay video renders on top so the underlying screen keeps its state */}
      {replayCfg && (
        <VideoOverlay key={'replay-' + sim.replay} cfg={replayCfg} onDone={sim.clearReplay} />
      )}

      {sim.toast && <div className="toast show">{sim.toast}</div>}
    </div>
  )
}

import Header from './components/Header'
import AlmaRail from './components/AlmaRail'
import Opening from './components/Opening'
import VideoOverlay from './components/VideoOverlay'
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
  const overlayCfg = replayCfg ?? (autoShow ? autoCfg : null)

  function handleDone() {
    if (replayCfg) {
      sim.clearReplay()
      return
    }
    const cfg = STEP_VIDEO[sim.step]
    if (cfg?.coin) {
      sim.markDone()
      sim.next()
    } else {
      sim.setVideoSeen(sim.step)
    }
  }

  return (
    <div id="app">
      <Header />

      <div className="layout">
        <main className="stage" key={sim.step}>
          <StepCmp />
        </main>
        <AlmaRail />
      </div>

      {overlayCfg && (
        <VideoOverlay
          key={(replayCfg ? 'replay-' : 'auto-') + sim.step + '-' + (sim.replay ?? '')}
          cfg={overlayCfg}
          onDone={handleDone}
        />
      )}

      {sim.toast && <div className="toast show">{sim.toast}</div>}
    </div>
  )
}

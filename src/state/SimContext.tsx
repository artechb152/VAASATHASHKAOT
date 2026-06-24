import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { BASE, clamp } from '../lib/utils'
import { STEPS } from '../data/content'
import type { AlmaMsg, Decisions, Kind, Trade } from '../types'

interface Sim {
  started: boolean
  start: () => void

  step: number
  goto: (i: number) => void
  next: () => void
  back: () => void
  maxReached: number

  risk: number
  profit: number
  flashTick: number
  setMeters: (risk: number, profit: number, flash?: boolean) => void

  done: Record<number, boolean>
  markDone: () => void

  videoSeen: Record<number, boolean>
  setVideoSeen: (s: number) => void
  replay: number | null
  requestReplay: (s: number) => void
  clearReplay: () => void

  decisions: Decisions
  setTrade: (t: Trade | null) => void
  setPortfolio: (p: Record<string, number>) => void

  messages: AlmaMsg[]
  almaSay: (html: string, kind?: Kind) => void
  almaSequence: (msgs: AlmaMsg[]) => void
  clearThread: () => void
  almaPointing: boolean
  setAlmaPointing: (b: boolean) => void

  toast: string | null
  showToast: (m: string) => void
}

const Ctx = createContext<Sim | null>(null)

export function SimProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [risk, setRisk] = useState(BASE)
  const [profit, setProfit] = useState(BASE)
  const [flashTick, setFlashTick] = useState(0)
  const [done, setDone] = useState<Record<number, boolean>>({})
  const [videoSeen, setVideoSeenState] = useState<Record<number, boolean>>({})
  const [replay, setReplay] = useState<number | null>(null)
  const [decisions, setDecisions] = useState<Decisions>({ trade: null, portfolio: null })
  const [messages, setMessages] = useState<AlmaMsg[]>([])
  const [almaPointing, setAlmaPointing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const stepRef = useRef(step)
  stepRef.current = step

  const start = useCallback(() => setStarted(true), [])

  const goto = useCallback((i: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const next = useCallback(() => goto(stepRef.current + 1), [goto])
  const back = useCallback(() => goto(stepRef.current - 1), [goto])

  const maxReached = useMemo(() => {
    let m = step
    for (let i = 0; i <= step; i++) if (done[i]) m = Math.max(m, i + 1)
    return Math.min(m, STEPS.length - 1)
  }, [step, done])

  const setMeters = useCallback((r: number, p: number, flash?: boolean) => {
    setRisk(clamp(r))
    setProfit(clamp(p))
    if (flash) setFlashTick((t) => t + 1)
  }, [])

  const markDone = useCallback(() => setDone((d) => ({ ...d, [stepRef.current]: true })), [])
  const setVideoSeen = useCallback((s: number) => setVideoSeenState((v) => ({ ...v, [s]: true })), [])
  const requestReplay = useCallback((s: number) => setReplay(s), [])
  const clearReplay = useCallback(() => setReplay(null), [])

  const setTrade = useCallback((t: Trade | null) => setDecisions((d) => ({ ...d, trade: t })), [])
  const setPortfolio = useCallback((p: Record<string, number>) => setDecisions((d) => ({ ...d, portfolio: p })), [])

  const almaSay = useCallback((html: string, kind?: Kind) => setMessages((m) => [...m, { html, kind }]), [])
  const almaSequence = useCallback((msgs: AlmaMsg[]) => setMessages(msgs), [])
  const clearThread = useCallback(() => setMessages([]), [])

  const toastTimer = useRef<number | undefined>(undefined)
  const showToast = useCallback((m: string) => {
    setToast(m)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const value = useMemo<Sim>(
    () => ({
      started, start,
      step, goto, next, back, maxReached,
      risk, profit, flashTick, setMeters,
      done, markDone,
      videoSeen, setVideoSeen, replay, requestReplay, clearReplay,
      decisions, setTrade, setPortfolio,
      messages, almaSay, almaSequence, clearThread, almaPointing, setAlmaPointing,
      toast, showToast,
    }),
    [
      started, start, step, goto, next, back, maxReached, risk, profit, flashTick, setMeters,
      done, markDone, videoSeen, setVideoSeen, replay, requestReplay, clearReplay,
      decisions, setTrade, setPortfolio, messages, almaSay, almaSequence, clearThread,
      almaPointing, setAlmaPointing, toast, showToast,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSim(): Sim {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSim must be used within SimProvider')
  return c
}

import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/utils'
import type { VideoCfg } from '../data/content'

export default function VideoOverlay({ cfg, onDone }: { cfg: VideoCfg; onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [revealed, setRevealed] = useState(false)
  const [showSkip, setShowSkip] = useState(false)
  const [showSound, setShowSound] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const v = videoRef.current
    v?.play().catch(() => {})
    const onEnded = () => setRevealed(true)
    v?.addEventListener('ended', onEnded)
    const t = window.setTimeout(() => setShowSkip(true), 5000)
    return () => {
      v?.removeEventListener('ended', onEnded)
      window.clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  const reveal = () => {
    setRevealed(true)
    setShowSkip(false)
  }
  const enableSound = () => {
    const v = videoRef.current
    if (v) {
      v.muted = false
      if (v.paused) v.play().catch(() => {})
    }
    setShowSound(false)
  }

  return (
    <div className="vfs">
      <video ref={videoRef} className="vfs-video" controls autoPlay muted playsInline preload="auto">
        <source src={cfg.src} type="video/mp4" />
        הדפדפן שלכם אינו תומך בהצגת וידאו.
      </video>

      {showSound && (
        <button className="vfs-sound" onClick={enableSound}>
          הפעלת קול
        </button>
      )}

      {showSkip && !revealed && (
        <button className="vfs-skip show" onClick={reveal}>
          דלג ←
        </button>
      )}

      {cfg.coin ? (
        <div className={'vfs-action video-coin-wrap' + (revealed ? ' show' : '')}>
          <button className="video-coin" aria-label="לחצו על המטבע כדי להמשיך" onClick={onDone}>
            <img src={asset('media/coin.png')} alt="" />
          </button>
          <div className="vfs-coin-cap">לחצו על המטבע כדי להמשיך</div>
        </div>
      ) : (
        <div className={'vfs-action vfs-cont-wrap' + (revealed ? ' show' : '')}>
          <button className="btn btn-primary btn-lg" onClick={onDone}>
            המשך לשלב הבא ◂
          </button>
        </div>
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/utils'
import type { VideoCfg } from '../data/content'

export default function VideoOverlay({
  cfg,
  onDone,
  blocked = false,
}: {
  cfg: VideoCfg
  onDone: () => void
  blocked?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const v = videoRef.current
    const onEnded = () => setRevealed(true)
    v?.addEventListener('ended', onEnded)
    return () => {
      v?.removeEventListener('ended', onEnded)
      try {
        v?.pause()
      } catch {
        /* ignore */
      }
      document.body.style.overflow = ''
    }
  }, [])

  // Start playing (with sound) only once nothing blocks it (e.g. the protocol
  // popup). The user already interacted, so sticky activation allows sound.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (blocked) {
      try {
        v.pause()
      } catch {
        /* ignore */
      }
    } else {
      v.muted = false
      v.play().catch(() => {})
    }
  }, [blocked])

  return (
    <div className="vfs">
      <video ref={videoRef} className="vfs-video" controls playsInline preload="auto">
        <source src={cfg.src} type="video/mp4" />
        הדפדפן שלכם אינו תומך בהצגת וידאו.
      </video>

      {/* Skip → advance to the next page immediately */}
      <button className="vfs-skip show" onClick={onDone}>
        דלג
      </button>

      {/* The coin (intro) / continue button appears when the video ends */}
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
            המשך לשלב הבא
          </button>
        </div>
      )}
    </div>
  )
}

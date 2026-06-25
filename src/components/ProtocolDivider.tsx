import { asset } from '../lib/utils'

export default function ProtocolDivider({
  message,
  onContinue,
  buttonLabel = 'ממשיכים',
}: {
  message: string
  onContinue: () => void
  buttonLabel?: string
}) {
  return (
    <div className="divider-screen">
      <video className="divider-bg" autoPlay muted loop playsInline>
        <source src={asset('media/opening.mp4')} type="video/mp4" />
      </video>
      <div className="divider-veil" />

      <div className="divider-content">
        <div className="divider-avawrap">
          <img className="divider-ava" src={asset('media/alma.jpeg')} alt="אלמה" />
          <span className="divider-status" aria-hidden="true" />
        </div>
        <div className="divider-name">אלמה</div>
        <p className="divider-msg" dangerouslySetInnerHTML={{ __html: message }} />
        <button
          className="btn btn-primary btn-lg"
          style={{ fontSize: 18, padding: '15px 40px' }}
          onClick={onContinue}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

import { asset } from '../lib/utils'
import { useSim } from '../state/SimContext'

export default function Opening() {
  const { start } = useSim()
  return (
    <section id="opening">
      <video autoPlay muted loop playsInline>
        <source src={asset('media/opening.mp4')} type="video/mp4" />
      </video>
      <div className="veil" />
      <div className="open-inner">
        <h1>וועדת ההשקעות</h1>
        <p>
          היכנסו לתפקיד חבר ועדת השקעות, קבלו תקציב של מיליון ש״ח, וגלו כיצד שוק ההון מחבר בין משקיעים,
          חברות וממשלות.
        </p>
        <button className="btn btn-primary btn-lg" onClick={start}>
          להתחלת הסימולציה
        </button>
      </div>
    </section>
  )
}

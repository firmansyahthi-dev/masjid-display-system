import type { DisplayConfig } from '../../../types/display';

interface AdzanDisplayProps {
  currentTime: Date;
  displayConfig: DisplayConfig;
  prayerName: string;
  countdown: string;
}

function AdzanDisplay({ prayerName, countdown }: AdzanDisplayProps) {
  // Hilangkan angka jam jika countdown masih di bawah satu jam.
  const displayCountdown = countdown.startsWith('00:')
    ? countdown.substring(3)
    : countdown;

  return (
    <main className="special-display adzan-display">
      <div className="adzan-frame">
        <section className="adzan-content">
          <h1 className="adzan-title">
            <span className="adzan-label">SAATNYA ADZAN </span>
            <span className="adzan-prayer-name">
              {prayerName.toUpperCase()}
            </span>
          </h1>

          <div className="adzan-countdown">
            <div className="adzan-countdown-red">
              <span className="adzan-alarm-icon">⏱</span>
              <span>{displayCountdown}</span>
            </div>

            <div className="adzan-countdown-gold" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdzanDisplay;

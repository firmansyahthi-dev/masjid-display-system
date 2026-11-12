import type { DisplayConfig } from '../../../types/display';

interface iqamahDisplayProps {
  currentTime: Date;
  displayConfig: DisplayConfig;
  prayerName: string;
  countdown: string;
}

function iqamahDisplay({ prayerName, countdown }: iqamahDisplayProps) {
  // Hilangkan angka jam jika countdown masih di bawah satu jam.
  const displayCountdown = countdown.startsWith('00:')
    ? countdown.substring(3)
    : countdown;

  return (
    <main className="special-display iqamah-display">
      <div className="iqamah-frame">
        <section className="iqamah-content">
          <h1 className="iqamah-title">
            <span className="iqamah-label">MENUJU IQAMAH </span>
            <span className="iqamah-prayer-name">
              {prayerName.toUpperCase()}
            </span>
          </h1>

          <div className="iqamah-countdown">
            <div className="iqamah-countdown-red">
              <span className="iqamah-alarm-icon">⏱</span>
              <span>{displayCountdown}</span>
            </div>

            <div className="iqamah-countdown-gold" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default iqamahDisplay;

import type { DisplayConfig } from '../../../types/display';

interface sholatDisplayProps {
  currentTime: Date;
  displayConfig: DisplayConfig;
  prayerName: string;
  countdown: string;
}

function sholatDisplay({ prayerName, countdown }: sholatDisplayProps) {
  // Hilangkan angka jam jika countdown masih di bawah satu jam.
  const displayCountdown = countdown.startsWith('00:')
    ? countdown.substring(3)
    : countdown;

  return (
    <main className="special-display sholat-display">
      <div className="sholat-frame">
        <section className="sholat-content">
          <div className="sholat-countdown">
            <div className="sholat-countdown-red">
              <span className="sholat-alarm-icon">⏱</span>
              <span>{displayCountdown}</span>
            </div>
            <div className="sholat-countdown-gold" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default sholatDisplay;

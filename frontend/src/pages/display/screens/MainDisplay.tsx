import type { CSSProperties } from 'react';
import type { DisplayConfig } from '../../../types/display';

import {
  formatClockWithSeconds,
  formatGregorianDate,
  formatHijriDate,
} from '../../../utils/date';

import { prayerSchedule } from '../../../services/prayerConfig';

interface MainDisplayProps {
  currentTime: Date;
  displayConfig: DisplayConfig;
  countdown: string;
  nextPrayerName: string;
}

function MainDisplay({
  currentTime,
  displayConfig,
  countdown,
  nextPrayerName,
}: MainDisplayProps) {
  const prayerTimes = prayerSchedule.prayers;

  return (
    <main
      className="display-page"
      style={
        {
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.05),
              rgba(0, 0, 0, 0.12)
            ),
            url("${displayConfig.backgroundUrl}")
          `,
          '--running-text-color': displayConfig.theme.runningTextColor,
        } as CSSProperties & {
          '--running-text-color': string;
        }
      }
    >
      {/* HEADER */}
      <header className="display-header">
        <div className="header-date">
          {displayConfig.settings.showGregorianDate && (
            <div className="header-gregorian">
              {formatGregorianDate(currentTime)}
            </div>
          )}

          {displayConfig.settings.showHijriDate && (
            <div className="header-hijri">{formatHijriDate(currentTime)}</div>
          )}
        </div>

        <div className="header-mosque">
          <h1>{displayConfig.mosqueName}</h1>
          <p>{displayConfig.mosqueAddress}</p>
        </div>

        {displayConfig.settings.showClock && (
          <div className="header-clock">
            {formatClockWithSeconds(currentTime)}
          </div>
        )}
      </header>

      {/* COUNTDOWN MENUJU ADZAN */}
      <section className="display-hero">
        <div className="hero-overlay" />

        <div className="hero-countdown">
          <div className="countdown-prayer">
            <span className="countdown-prayer-name">{nextPrayerName}</span>

            <span className="countdown-separator">-</span>

            <span className="countdown-value">{countdown}</span>
          </div>

          <div className="countdown-caption">MENUJU WAKTU ADZAN</div>
        </div>
      </section>

      {/* JADWAL SHOLAT */}
      <section className="prayer-schedule-bar">
        {prayerTimes.map((prayer, index) => (
          <div
            key={prayer.name}
            className={`schedule-card ${
              prayer.name === nextPrayerName ? 'active' : ''
            }`}
            style={{
              backgroundColor: displayConfig.theme.scheduleColors[index],
            }}
          >
            <div className="schedule-name">{prayer.name}</div>

            <div className="schedule-time">{prayer.time}</div>
          </div>
        ))}
      </section>

      {/* RUNNING TEXT */}
      <footer className="display-running-text">
        <div className="running-content">
          <div className="running-group">
            <span>{displayConfig.runningTexts.join(' • ')}</span>
          </div>

          <div className="running-group" aria-hidden="true">
            <span>{displayConfig.runningTexts.join(' • ')}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default MainDisplay;

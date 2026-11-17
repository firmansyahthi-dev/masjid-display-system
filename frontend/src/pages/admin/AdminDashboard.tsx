import { useEffect, useState } from 'react';

import type { DisplayConfig } from '../../types/display';
import { getDisplayConfig } from '../../services/displayService';

import './admin.css';

const TENANT_ID = 'demo-masjid';

export default function AdminDashboard() {
  const [config, setConfig] = useState<DisplayConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        setLoading(true);
        setError('');

        const data = await getDisplayConfig(TENANT_ID);

        if (isMounted) {
          setConfig(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Gagal mengambil konfigurasi masjid'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="admin-loading">Memuat Dashboard Admin...</div>;
  }

  if (error || !config) {
    return (
      <div className="admin-error">
        <h2>Gagal Memuat Dashboard</h2>
        <p>{error || 'Konfigurasi masjid tidak tersedia.'}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Pengelolaan informasi dan Display Masjid</p>
        </div>

        <div className="admin-profile">Administrator</div>
      </header>

      <section className="admin-mosque-info">
        <div>
          <h2>{config.mosqueName}</h2>
          <p>{config.mosqueAddress}</p>
          <span className="admin-status">Masjid Aktif</span>
        </div>
      </section>

      <section className="admin-summary">
        <div className="admin-card">
          <span>Running Text</span>
          <strong>{config.runningTexts.length}</strong>
          <small>Pesan informasi</small>
        </div>

        <div className="admin-card">
          <span>Audio Display</span>
          <strong>{config.audio.enabled ? 'Aktif' : 'Nonaktif'}</strong>
          <small>Volume {config.audio.volume}%</small>
        </div>

        <div className="admin-card">
          <span>Tampilan Jam</span>
          <strong>{config.settings.showClock ? 'Aktif' : 'Nonaktif'}</strong>
          <small>Jam pada Display TV</small>
        </div>

        <div className="admin-card">
          <span>Jadwal Sholat</span>
          <strong>
            {config.settings.showPrayerSchedule ? 'Aktif' : 'Nonaktif'}
          </strong>
          <small>Jadwal pada Display TV</small>
        </div>
      </section>

      <section className="admin-content">
        <div className="admin-panel">
          <h3>Informasi Display</h3>

          <div className="admin-info-row">
            <span>Tanggal Masehi</span>
            <strong>
              {config.settings.showGregorianDate
                ? 'Ditampilkan'
                : 'Disembunyikan'}
            </strong>
          </div>

          <div className="admin-info-row">
            <span>Tanggal Hijriah</span>
            <strong>
              {config.settings.showHijriDate ? 'Ditampilkan' : 'Disembunyikan'}
            </strong>
          </div>

          <div className="admin-info-row">
            <span>Countdown</span>
            <strong>
              {config.settings.showCountdown ? 'Aktif' : 'Nonaktif'}
            </strong>
          </div>

          <div className="admin-info-row">
            <span>Running Text</span>
            <strong>
              {config.settings.showRunningText ? 'Aktif' : 'Nonaktif'}
            </strong>
          </div>
        </div>

        <div className="admin-panel">
          <h3>Running Text</h3>

          {config.runningTexts.map((message, index) => (
            <div className="admin-running-text" key={index}>
              <span>{index + 1}.</span>
              <p>{message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

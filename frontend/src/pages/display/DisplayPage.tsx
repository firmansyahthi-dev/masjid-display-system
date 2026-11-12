import { useEffect, useRef, useState } from 'react';

import { displayDefaults } from '../../config/displayDefaults';
import { prayerSchedule } from '../../services/prayerConfig';

import AdzanDisplay from './screens/AdzanDisplay';
import './styles/adzan.css';

import IqamahDisplay from './screens/IqamahDisplay';
import './styles/iqamah.css';

import SholatDisplay from './screens/SholatDisplay';
import './styles/sholat.css';

import MainDisplay from './screens/MainDisplay';

import './display.css';

function DisplayPage() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Status aktivasi suara
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Pemutar file MP3
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Menyimpan identitas suara terakhir
  const lastBeepKey = useRef<string | null>(null);

  // Mengaktifkan suara melalui interaksi pengguna
  const handleEnableSound = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/prayer-beep.mp3');
        audioRef.current.preload = 'auto';
        audioRef.current.volume = 0.7;
      }

      const audio = audioRef.current;

      // Memutar MP3 sekali sebagai tes sekaligus aktivasi audio
      audio.currentTime = 0;
      await audio.play();

      setSoundEnabled(true);

      // Mencegah suara kejadian aktif diputar dua kali
      if (
        activePrayerTimestamp !== null &&
        (prayerPhase === 'ADZAN' || prayerPhase === 'SHOLAT')
      ) {
        lastBeepKey.current = `${activePrayerTimestamp}-${prayerPhase}`;
      }
    } catch (error) {
      console.error('Gagal mengaktifkan suara:', error);
      alert('Suara gagal diputar. Periksa file MP3 dan izin audio browser.');
    }
  };

  // Memutar satu kali file MP3
  const playBeep = () => {
    const audio = audioRef.current;

    if (!audio || !soundEnabled) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch((error) => {
      console.error('Gagal memutar MP3:', error);
    });
  };

  const displayConfig = displayDefaults;

  // Memperbarui waktu setiap detik
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const prayerTimes = prayerSchedule.prayers;

  // Durasi tampilan dalam detik
  const ADZAN_DURATION_SECONDS = 1 * 60;
  const SHOLAT_DURATION_SECONDS = 1 * 30;

  // Membuat jadwal sholat untuk hari ini dan kemarin
  const prayerEvents = [-1, 0].flatMap((dayOffset) =>
    prayerTimes
      .filter((prayer) => prayer.isPrayer)
      .map((prayer) => {
        const [hours, minutes] = prayer.time.split(':').map(Number);

        const prayerDate = new Date(currentTime);

        prayerDate.setDate(prayerDate.getDate() + dayOffset);
        prayerDate.setHours(hours, minutes, 0, 0);

        return {
          ...prayer,
          prayerDate,
          iqamahSeconds: (prayer.iqamah ?? 1) * 6,
        };
      })
  );

  // Mencari sholat yang sedang berlangsung
  const activePrayer = prayerEvents
    .filter((prayer) => {
      const elapsedSeconds = Math.floor(
        (currentTime.getTime() - prayer.prayerDate.getTime()) / 1000
      );

      const totalDuration =
        ADZAN_DURATION_SECONDS + prayer.iqamahSeconds + SHOLAT_DURATION_SECONDS;

      return elapsedSeconds >= 0 && elapsedSeconds < totalDuration;
    })
    .sort((a, b) => b.prayerDate.getTime() - a.prayerDate.getTime())[0];

  // Menentukan tahap sholat
  let prayerPhase: 'IDLE' | 'ADZAN' | 'IQAMAH' | 'SHOLAT' = 'IDLE';

  let phaseRemainingSeconds = 0;

  if (activePrayer) {
    const elapsedSeconds = Math.floor(
      (currentTime.getTime() - activePrayer.prayerDate.getTime()) / 1000
    );

    const iqamahEnd = ADZAN_DURATION_SECONDS + activePrayer.iqamahSeconds;

    if (elapsedSeconds < ADZAN_DURATION_SECONDS) {
      prayerPhase = 'ADZAN';
      phaseRemainingSeconds = ADZAN_DURATION_SECONDS - elapsedSeconds;
    } else if (elapsedSeconds < iqamahEnd) {
      prayerPhase = 'IQAMAH';
      phaseRemainingSeconds = iqamahEnd - elapsedSeconds;
    } else {
      prayerPhase = 'SHOLAT';

      phaseRemainingSeconds =
        iqamahEnd + SHOLAT_DURATION_SECONDS - elapsedSeconds;
    }
  }

  // Menentukan jadwal sholat berikutnya
  const nextPrayer = prayerTimes
    .filter((prayer) => prayer.isPrayer)
    .map((prayer) => {
      const [hours, minutes] = prayer.time.split(':').map(Number);

      const prayerDate = new Date(currentTime);

      prayerDate.setHours(hours, minutes, 0, 0);

      if (prayerDate <= currentTime) {
        prayerDate.setDate(prayerDate.getDate() + 1);
      }

      return {
        ...prayer,
        prayerDate,
      };
    })
    .sort((a, b) => a.prayerDate.getTime() - b.prayerDate.getTime())[0];

  // Countdown menuju Adzan atau sisa waktu tahap aktif
  const remainingSeconds =
    prayerPhase === 'IDLE' && nextPrayer
      ? Math.max(
          0,
          Math.floor(
            (nextPrayer.prayerDate.getTime() - currentTime.getTime()) / 1000
          )
        )
      : phaseRemainingSeconds;

  // Format countdown HH:MM:SS
  const countdownHours = Math.floor(remainingSeconds / 3600);
  const countdownMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const countdownSecs = remainingSeconds % 60;

  const countdown = [countdownHours, countdownMinutes, countdownSecs]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');

  // Identitas waktu sholat yang sedang aktif
  const activePrayerTimestamp = activePrayer?.prayerDate.getTime() ?? null;

  // Memutar MP3 otomatis saat memasuki fase Adzan atau Sholat
  useEffect(() => {
    if (!soundEnabled || !activePrayer || activePrayerTimestamp === null) {
      return;
    }

    if (prayerPhase !== 'ADZAN' && prayerPhase !== 'SHOLAT') {
      return;
    }

    const beepKey = `${activePrayerTimestamp}-${prayerPhase}`;

    // Mencegah pemutaran berulang setiap render
    if (lastBeepKey.current === beepKey) {
      return;
    }

    lastBeepKey.current = beepKey;

    playBeep();
  }, [prayerPhase, activePrayerTimestamp, soundEnabled]);

  return (
    <>
      <button
        onClick={handleEnableSound}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 9999,
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid #d6b65b',
          background: soundEnabled ? '#176b3a' : '#b8860b',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {soundEnabled ? '🔊 Suara Aktif' : '🔇 Aktifkan Suara'}
      </button>

      {prayerPhase === 'IDLE' && (
        <MainDisplay
          currentTime={currentTime}
          displayConfig={displayConfig}
          countdown={countdown}
          nextPrayerName={nextPrayer?.name ?? '--'}
        />
      )}

      {prayerPhase === 'ADZAN' && activePrayer && (
        <AdzanDisplay
          displayConfig={displayConfig}
          prayerName={activePrayer.name}
          countdown={countdown}
        />
      )}

      {prayerPhase === 'IQAMAH' && activePrayer && (
        <IqamahDisplay
          displayConfig={displayConfig}
          prayerName={activePrayer.name}
          countdown={countdown}
        />
      )}

      {prayerPhase === 'SHOLAT' && activePrayer && (
        <SholatDisplay
          currentTime={currentTime}
          displayConfig={displayConfig}
          prayerName={activePrayer.name}
          countdown={countdown}
        />
      )}
    </>
  );
}

export default DisplayPage;

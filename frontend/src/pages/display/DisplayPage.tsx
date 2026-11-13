import { useEffect, useRef, useState } from 'react';

import { displayDefaults } from '../../config/displayDefaults';
import { prayerSchedule } from '../../services/prayerConfig';

import AdzanDisplay from './screens/AdzanDisplay';
import './styles/adzan.css';

import IqamahDisplay from './screens/IqamahDisplay';
import './styles/iqamah.css';

import SholatDisplay from './screens/SholatDisplay';
import './styles/sholat.css';

import SyuruqDisplay from './screens/SyuruqDisplay';

import KhutbahDisplay from './screens/KhutbahDisplay';
import './styles/khutbah.css';

import MainDisplay from './screens/MainDisplay';

import './display.css';

function DisplayPage() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Konfigurasi display dan audio
  const displayConfig = displayDefaults;
  const audioConfig = displayConfig.audio;

  // Status aktivasi suara oleh pengguna
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Pemutar file MP3
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Menyimpan identitas suara terakhir
  const lastBeepKey = useRef<string | null>(null);

  // Mengaktifkan suara melalui interaksi pengguna
  const handleEnableSound = async () => {
    if (!audioConfig.enabled) {
      return;
    }

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioConfig.soundUrl);
        audioRef.current.preload = 'auto';
      }

      const audio = audioRef.current;

      // Mengatur volume berdasarkan konfigurasi (0-100)
      audio.volume = Math.min(1, Math.max(0, audioConfig.volume / 100));

      // Memutar MP3 sekali sebagai tes
      audio.currentTime = 0;
      await audio.play();

      setSoundEnabled(true);

      // Mencegah suara kejadian aktif diputar dua kali
      const currentPhaseEnabled =
        (prayerPhase === 'ADZAN' && audioConfig.adzanEnabled) ||
        (prayerPhase === 'SHOLAT' && audioConfig.iqamahEnabled);

      if (activePrayerTimestamp !== null && currentPhaseEnabled) {
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

    if (!audio || !soundEnabled || !audioConfig.enabled) {
      return;
    }

    audio.volume = Math.min(1, Math.max(0, audioConfig.volume / 100));

    audio.pause();
    audio.currentTime = 0;

    audio.play().catch((error) => {
      console.error('Gagal memutar MP3:', error);
    });
  };

  // Memperbarui waktu setiap detik
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const prayerTimes = prayerSchedule.prayers;

  // Mengambil jadwal Syuruq
  const syuruqPrayer = prayerTimes.find(
    (prayer) => prayer.name.toUpperCase() === 'SYURUQ'
  );

  // Menentukan waktu mulai dan akhir Syuruq hari ini
  const syuruqStart = syuruqPrayer
    ? (() => {
        const [hours, minutes] = syuruqPrayer.time.split(':').map(Number);

        const date = new Date(currentTime);
        date.setHours(hours, minutes, 0, 0);

        return date;
      })()
    : null;

  // Waktu larangan sholat sunnah berakhir 15 menit setelah Syuruq
  const syuruqEnd = syuruqStart
    ? new Date(syuruqStart.getTime() + 15 * 60 * 1000)
    : null;

  // Memeriksa apakah sedang dalam waktu larangan setelah Syuruq
  const isSyuruqActive =
    syuruqStart !== null &&
    syuruqEnd !== null &&
    currentTime >= syuruqStart &&
    currentTime < syuruqEnd;

  // Countdown sisa waktu larangan Syuruq
  const syuruqRemainingSeconds =
    syuruqEnd !== null
      ? Math.max(
          0,
          Math.ceil((syuruqEnd.getTime() - currentTime.getTime()) / 1000)
        )
      : 0;

  // Format waktu akhir Syuruq HH:MM
  const syuruqEndTime = syuruqEnd
    ? `${String(syuruqEnd.getHours()).padStart(2, '0')}:${String(
        syuruqEnd.getMinutes()
      ).padStart(2, '0')}`
    : '--:--';

  // Durasi tampilan dalam detik
  const ADZAN_DURATION_SECONDS = 1 * 60;
  const SHOLAT_DURATION_SECONDS = 1 * 30;

  // Durasi Khutbah Jumat: 45 menit
  const KHUTBAH_DURATION_SECONDS = 45 * 60;

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

      const isFridayDhuhr =
        prayer.prayerDate.getDay() === 5 &&
        prayer.name.toUpperCase() === 'DZUHUR';

      const totalDuration = isFridayDhuhr
        ? ADZAN_DURATION_SECONDS + KHUTBAH_DURATION_SECONDS
        : ADZAN_DURATION_SECONDS +
          prayer.iqamahSeconds +
          SHOLAT_DURATION_SECONDS;

      return elapsedSeconds >= 0 && elapsedSeconds < totalDuration;
    })
    .sort((a, b) => b.prayerDate.getTime() - a.prayerDate.getTime())[0];

  // Menentukan tahap sholat
  let prayerPhase: 'IDLE' | 'ADZAN' | 'IQAMAH' | 'SHOLAT' | 'KHUTBAH' = 'IDLE';

  let phaseRemainingSeconds = 0;

  if (activePrayer) {
    const elapsedSeconds = Math.floor(
      (currentTime.getTime() - activePrayer.prayerDate.getTime()) / 1000
    );

    const isFridayDhuhr =
      activePrayer.prayerDate.getDay() === 5 &&
      activePrayer.name.toUpperCase() === 'DZUHUR';

    const iqamahEnd = ADZAN_DURATION_SECONDS + activePrayer.iqamahSeconds;

    if (isFridayDhuhr) {
      const khutbahEnd = ADZAN_DURATION_SECONDS + KHUTBAH_DURATION_SECONDS;

      if (elapsedSeconds < ADZAN_DURATION_SECONDS) {
        prayerPhase = 'ADZAN';

        phaseRemainingSeconds = ADZAN_DURATION_SECONDS - elapsedSeconds;
      } else {
        prayerPhase = 'KHUTBAH';

        phaseRemainingSeconds = khutbahEnd - elapsedSeconds;
      }
    } else if (elapsedSeconds < ADZAN_DURATION_SECONDS) {
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

  // Memutar MP3 otomatis saat memasuki fase yang diaktifkan
  useEffect(() => {
    if (
      !audioConfig.enabled ||
      !soundEnabled ||
      !activePrayer ||
      activePrayerTimestamp === null
    ) {
      return;
    }

    // Memeriksa apakah suara untuk fase ini diaktifkan
    const phaseAudioEnabled =
      (prayerPhase === 'ADZAN' && audioConfig.adzanEnabled) ||
      (prayerPhase === 'SHOLAT' && audioConfig.iqamahEnabled);

    if (!phaseAudioEnabled) {
      return;
    }

    const beepKey = `${activePrayerTimestamp}-${prayerPhase}`;

    // Mencegah pemutaran berulang setiap render
    if (lastBeepKey.current === beepKey) {
      return;
    }

    lastBeepKey.current = beepKey;

    playBeep();
  }, [
    prayerPhase,
    activePrayerTimestamp,
    soundEnabled,
    audioConfig.enabled,
    audioConfig.adzanEnabled,
    audioConfig.iqamahEnabled,
  ]);

  return (
    <>
      <button
        onClick={handleEnableSound}
        disabled={!audioConfig.enabled}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 9999,
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid #d6b65b',
          background: !audioConfig.enabled
            ? '#555'
            : soundEnabled
            ? '#176b3a'
            : '#b8860b',
          color: '#fff',
          fontWeight: 600,
          cursor: audioConfig.enabled ? 'pointer' : 'not-allowed',
        }}
      >
        {!audioConfig.enabled
          ? '🔇 Suara Dinonaktifkan'
          : soundEnabled
          ? '🔊 Suara Aktif'
          : '🔇 Aktifkan Suara'}
      </button>

      {/* Tampilan Syuruq selama 15 menit */}
      {isSyuruqActive && (
        <SyuruqDisplay
          syuruqTime={syuruqPrayer?.time ?? '--:--'}
          forbiddenEndTime={syuruqEndTime}
          remainingSeconds={syuruqRemainingSeconds}
        />
      )}

      {/* Tampilan utama ketika tidak ada fase sholat atau Syuruq */}
      {prayerPhase === 'IDLE' && !isSyuruqActive && (
        <MainDisplay
          currentTime={currentTime}
          displayConfig={displayConfig}
          countdown={countdown}
          nextPrayerName={nextPrayer?.name ?? '--'}
        />
      )}

      {prayerPhase === 'ADZAN' && activePrayer && (
        <AdzanDisplay
          currentTime={currentTime}
          displayConfig={displayConfig}
          prayerName={activePrayer.name}
          countdown={countdown}
        />
      )}

      {prayerPhase === 'KHUTBAH' && activePrayer && (
        <KhutbahDisplay displayConfig={displayConfig} countdown={countdown} />
      )}

      {prayerPhase === 'IQAMAH' && activePrayer && (
        <IqamahDisplay
          currentTime={currentTime}
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

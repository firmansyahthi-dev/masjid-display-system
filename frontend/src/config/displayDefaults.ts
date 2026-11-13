import type { DisplayConfig } from '../types/display';

export const displayDefaults: DisplayConfig = {
  tenantId: 'demo-masjid',

  mosqueName: 'MASJID AL BARKAH',
  mosqueAddress: 'Jl. Merpati Raya No. 10, Pamulang, Tangerang Selatan',

  logoUrl: null,
  backgroundUrl: '/images/mosque-background.jpg',

  runningTexts: [
    'Mohon luruskan dan rapatkan shaf sholat.',
    'Matikan atau senyapkan perangkat komunikasi selama berada di dalam masjid.',
  ],

  theme: {
    headerBackground: 'rgba(5, 12, 19, 0.58)',
    clockColor: '#ff9700',

    scheduleColors: [
      '#0f685e',
      '#a53f26',
      '#a06f0d',
      '#347437',
      '#662577',
      '#185384',
    ],

    runningTextColor: '#d3ae51',
  },

  settings: {
    showGregorianDate: true,
    showHijriDate: true,
    showClock: true,
    showCountdown: true,
    showPrayerSchedule: true,
    showRunningText: true,
  },

  audio: {
    enabled: true,
    adzanEnabled: true,
    iqamahEnabled: true,
    volume: 70,
    soundUrl: '/sounds/prayer-beep.mp3',
  },
};

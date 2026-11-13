export interface DisplayConfig {
  tenantId: string;

  // Profil masjid
  mosqueName: string;
  mosqueAddress: string;
  logoUrl: string | null;

  // Background Display
  backgroundUrl: string;

  // Running text
  runningTexts: string[];

  // Tema Display
  theme: {
    headerBackground: string;
    clockColor: string;
    scheduleColors: string[];
    runningTextColor: string;
  };

  // Pengaturan tampilan
  settings: {
    showGregorianDate: boolean;
    showHijriDate: boolean;
    showClock: boolean;
    showCountdown: boolean;
    showPrayerSchedule: boolean;
    showRunningText: boolean;
  };

  // Pengaturan audio
  audio: {
    enabled: boolean;
    adzanEnabled: boolean;
    iqamahEnabled: boolean;
    volume: number;
    soundUrl: string;
  };
}

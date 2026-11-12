export interface DisplayConfig {
  tenantId: string;
  mosqueName: string;
  mosqueAddress: string;
  logoUrl: string | null;
  backgroundUrl: string;
  runningTexts: string[];
  theme: {
    headerBackground: string;
    clockColor: string;
    scheduleColors: string[];
    runningTextColor: string;
  };
  settings: {
    showGregorianDate: boolean;
    showHijriDate: boolean;
    showClock: boolean;
    showCountdown: boolean;
    showPrayerSchedule: boolean;
    showRunningText: boolean;
  };
}

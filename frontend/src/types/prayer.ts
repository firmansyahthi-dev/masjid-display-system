
export type PrayerName =
| "SUBUH"
| "DZUHUR"
| "ASHAR"
| "MAGHRIB"
| "ISYA";

export type PrayerScheduleItem = {
name: PrayerName | "SYURUQ";
time: string;
iqamah?: number;
isPrayer: boolean;
};

export type PrayerSchedule = {
date: string;
prayers: PrayerScheduleItem[];
};

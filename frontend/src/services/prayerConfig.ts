import type { PrayerSchedule } from '../types/prayer';

export const prayerSchedule: PrayerSchedule = {
  date: new Date().toISOString().slice(0, 10),

  prayers: [
    {
      name: 'SUBUH',
      time: '05:11',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'SYURUQ',
      time: '06:22',
      isPrayer: false,
    },
    {
      name: 'DZUHUR',
      time: '13:22',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ASHAR',
      time: '17:09',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'MAGHRIB',
      time: '18:35',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ISYA',
      time: '23:15',
      iqamah: 10,
      isPrayer: true,
    },
  ],
};

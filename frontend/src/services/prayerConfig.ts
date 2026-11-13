import type { PrayerSchedule } from '../types/prayer';

export const prayerSchedule: PrayerSchedule = {
  date: new Date().toISOString().slice(0, 10),

  prayers: [
    {
      name: 'SUBUH',
      time: '04:03',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'SYURUQ',
      time: '05:25',
      isPrayer: false,
    },
    {
      name: 'DZUHUR',
      time: '11:37',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ASHAR',
      time: '14:58',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'MAGHRIB',
      time: '17:49',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ISYA',
      time: '19:02',
      iqamah: 10,
      isPrayer: true,
    },
  ],
};

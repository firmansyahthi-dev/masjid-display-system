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
      time: '05:58',
      isPrayer: false,
    },
    {
      name: 'DZUHUR',
      time: '12:14',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ASHAR',
      time: '14:52',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'MAGHRIB',
      time: '18:00',
      iqamah: 10,
      isPrayer: true,
    },
    {
      name: 'ISYA',
      time: '22:37',
      iqamah: 10,
      isPrayer: true,
    },
  ],
};

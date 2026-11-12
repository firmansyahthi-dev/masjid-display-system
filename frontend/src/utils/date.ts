const TIME_ZONE = 'Asia/Jakarta';

const clockFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const gregorianFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatClock(date: Date): string {
  return clockFormatter.format(date);
}

export function formatGregorianDate(date: Date): string {
  return gregorianFormatter.format(date).toLocaleUpperCase('id-ID');
}

export function formatHijriDate(date: Date): string {
  return hijriFormatter.format(date);
}

export function formatClockWithSeconds(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

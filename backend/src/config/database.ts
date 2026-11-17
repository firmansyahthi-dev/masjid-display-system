import initSqlJs from 'sql.js';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Lokasi penyimpanan database
const dataDirectory = resolve(process.cwd(), 'data');

mkdirSync(dataDirectory, { recursive: true });

const databasePath = resolve(dataDirectory, 'masjid.db');

// Lokasi file WebAssembly sql.js
const wasmPath = resolve(
  process.cwd(),
  'node_modules/sql.js/dist/sql-wasm.wasm'
);

// Inisialisasi SQLite WebAssembly
const SQL = await initSqlJs({
  locateFile: () => wasmPath,
});

// Membuka database yang sudah ada atau membuat database baru
const db = existsSync(databasePath)
  ? new SQL.Database(new Uint8Array(readFileSync(databasePath)))
  : new SQL.Database();

// Menyimpan database ke file
export function saveDatabase() {
  const data = db.export();

  writeFileSync(databasePath, Buffer.from(data));
}

// Membuat tabel tenant
db.run(`
  CREATE TABLE IF NOT EXISTS tenants (
    tenant_id TEXT PRIMARY KEY,
    mosque_name TEXT NOT NULL,
    mosque_address TEXT,
    logo_url TEXT,
    background_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Memasukkan tenant demo jika belum tersedia
db.run(
  `
    INSERT OR IGNORE INTO tenants (
      tenant_id,
      mosque_name,
      mosque_address,
      logo_url,
      background_url,
      status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `,
  [
    'demo-masjid',
    'MASJID AL BARKAH',
    'Jl. Merpati Raya No. 10, Pamulang, Tangerang Selatan',
    null,
    '/images/mosque-background.jpg',
    'active',
  ]
);

// Membuat tabel konfigurasi Display per tenant
db.run(`
  CREATE TABLE IF NOT EXISTS display_settings (
    tenant_id TEXT PRIMARY KEY,
    logo_url TEXT,
    background_url TEXT,
    running_texts_json TEXT NOT NULL,
    theme_json TEXT NOT NULL,
    settings_json TEXT NOT NULL,
    audio_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
      ON DELETE CASCADE
  );
`);

// Konfigurasi awal untuk demo-masjid
const demoDisplayConfig = {
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

// Masukkan konfigurasi awal jika belum tersedia
db.run(
  `
    INSERT OR IGNORE INTO display_settings (
      tenant_id,
      logo_url,
      background_url,
      running_texts_json,
      theme_json,
      settings_json,
      audio_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  [
    'demo-masjid',
    demoDisplayConfig.logoUrl,
    demoDisplayConfig.backgroundUrl,
    JSON.stringify(demoDisplayConfig.runningTexts),
    JSON.stringify(demoDisplayConfig.theme),
    JSON.stringify(demoDisplayConfig.settings),
    JSON.stringify(demoDisplayConfig.audio),
  ]
);

// Simpan database pertama kali
saveDatabase();

console.log('Database SQLite berhasil diinisialisasi:', databasePath);

export default db;

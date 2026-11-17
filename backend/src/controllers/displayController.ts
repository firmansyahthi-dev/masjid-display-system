import type { Request, Response } from 'express';
import db, { saveDatabase } from '../config/database.js';

export function getDisplayConfig(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;

    const result = db.exec(
      `
        SELECT
          t.tenant_id,
          t.mosque_name,
          t.mosque_address,
          t.status,
          d.logo_url,
          d.background_url,
          d.running_texts_json,
          d.theme_json,
          d.settings_json,
          d.audio_json
        FROM tenants t
        LEFT JOIN display_settings d
          ON t.tenant_id = d.tenant_id
        WHERE t.tenant_id = ?
        LIMIT 1
      `,
      [tenantId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Masjid tidak ditemukan',
      });
    }

    const columns = result[0].columns;
    const row = result[0].values[0];

    const tenant = Object.fromEntries(
      columns.map((column, index) => [column, row[index]])
    );

    if (tenant.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Masjid sedang tidak aktif',
      });
    }

    if (!tenant.running_texts_json) {
      return res.status(404).json({
        success: false,
        message: 'Konfigurasi Display belum tersedia',
      });
    }

    const config = {
      tenantId: tenant.tenant_id,
      mosqueName: tenant.mosque_name,
      mosqueAddress: tenant.mosque_address,
      logoUrl: tenant.logo_url,
      backgroundUrl: tenant.background_url,
      runningTexts: JSON.parse(String(tenant.running_texts_json)),
      theme: JSON.parse(String(tenant.theme_json)),
      settings: JSON.parse(String(tenant.settings_json)),
      audio: JSON.parse(String(tenant.audio_json)),
    };

    return res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Gagal mengambil konfigurasi Display:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil konfigurasi Display',
    });
  }
}

export function updateDisplayConfig(req: Request, res: Response) {
  try {
    const { tenantId } = req.params;
    const body = (req.body ?? {}) as Record<string, unknown>;

    const has = (key: string) =>
      Object.prototype.hasOwnProperty.call(body, key);

    const isObject = (value: unknown): value is Record<string, unknown> =>
      typeof value === 'object' && value !== null && !Array.isArray(value);

    // Ambil konfigurasi masjid saat ini
    const result = db.exec(
      `
        SELECT
          t.tenant_id,
          t.mosque_name,
          t.mosque_address,
          t.status,
          d.logo_url,
          d.background_url,
          d.running_texts_json,
          d.theme_json,
          d.settings_json,
          d.audio_json
        FROM tenants t
        LEFT JOIN display_settings d
          ON t.tenant_id = d.tenant_id
        WHERE t.tenant_id = ?
        LIMIT 1
      `,
      [tenantId]
    );

    if (result.length === 0 || result[0].values.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Masjid tidak ditemukan',
      });
    }

    const tenant = Object.fromEntries(
      result[0].columns.map((column, index) => [
        column,
        result[0].values[0][index],
      ])
    );

    if (tenant.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Masjid sedang tidak aktif',
      });
    }

    if (!tenant.running_texts_json) {
      return res.status(404).json({
        success: false,
        message: 'Konfigurasi Display belum tersedia',
      });
    }

    // Identitas masjid
    const mosqueNameValue = has('mosqueName')
      ? body.mosqueName
      : tenant.mosque_name;

    const mosqueAddressValue = has('mosqueAddress')
      ? body.mosqueAddress
      : tenant.mosque_address;

    if (typeof mosqueNameValue !== 'string' || mosqueNameValue.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nama masjid tidak valid',
      });
    }

    if (mosqueAddressValue !== null && typeof mosqueAddressValue !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Alamat masjid tidak valid',
      });
    }

    // Logo dan background
    const logoUrlValue = has('logoUrl') ? body.logoUrl : tenant.logo_url;

    const backgroundUrlValue = has('backgroundUrl')
      ? body.backgroundUrl
      : tenant.background_url;

    if (logoUrlValue !== null && typeof logoUrlValue !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Logo URL tidak valid',
      });
    }

    if (backgroundUrlValue !== null && typeof backgroundUrlValue !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Background URL tidak valid',
      });
    }

    // Ambil konfigurasi sebelumnya
    const runningTexts = has('runningTexts')
      ? body.runningTexts
      : JSON.parse(String(tenant.running_texts_json));

    const theme = has('theme')
      ? body.theme
      : JSON.parse(String(tenant.theme_json));

    const settings = has('settings')
      ? body.settings
      : JSON.parse(String(tenant.settings_json));

    const audio = has('audio')
      ? body.audio
      : JSON.parse(String(tenant.audio_json));

    // Validasi konfigurasi
    if (
      !Array.isArray(runningTexts) ||
      !runningTexts.every((item) => typeof item === 'string')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Format running text tidak valid',
      });
    }

    if (!isObject(theme) || !isObject(settings) || !isObject(audio)) {
      return res.status(400).json({
        success: false,
        message: 'Format konfigurasi Display tidak valid',
      });
    }

    // Simpan identitas masjid
    db.run(
      `
        UPDATE tenants
        SET
          mosque_name = ?,
          mosque_address = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ?
      `,
      [mosqueNameValue, mosqueAddressValue, tenantId]
    );

    // Simpan konfigurasi Display
    db.run(
      `
        UPDATE display_settings
        SET
          logo_url = ?,
          background_url = ?,
          running_texts_json = ?,
          theme_json = ?,
          settings_json = ?,
          audio_json = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ?
      `,
      [
        logoUrlValue,
        backgroundUrlValue,
        JSON.stringify(runningTexts),
        JSON.stringify(theme),
        JSON.stringify(settings),
        JSON.stringify(audio),
        tenantId,
      ]
    );

    // Simpan perubahan SQLite ke file
    saveDatabase();

    return res.status(200).json({
      success: true,
      message: 'Konfigurasi Display berhasil disimpan',
      data: {
        tenantId,
        mosqueName: mosqueNameValue,
        mosqueAddress: mosqueAddressValue,
        logoUrl: logoUrlValue,
        backgroundUrl: backgroundUrlValue,
        runningTexts,
        theme,
        settings,
        audio,
      },
    });
  } catch (error) {
    console.error('Gagal menyimpan konfigurasi Display:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan konfigurasi Display',
    });
  }
}

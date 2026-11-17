import db from '../config/database.js';
import { getSingleRouteParam } from '../utils/routeParams.js';
// Mengambil seluruh data masjid
export function getTenants(_req, res) {
    try {
        const result = db.exec(`
      SELECT
        tenant_id AS tenantId,
        mosque_name AS mosqueName,
        mosque_address AS mosqueAddress,
        logo_url AS logoUrl,
        background_url AS backgroundUrl,
        status,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM tenants
      ORDER BY mosque_name ASC
    `);
        const tenants = result.length > 0
            ? result[0].values.map((row) => {
                const columns = result[0].columns;
                return Object.fromEntries(columns.map((column, index) => [column, row[index]]));
            })
            : [];
        return res.status(200).json({
            success: true,
            total: tenants.length,
            data: tenants,
        });
    }
    catch (error) {
        console.error('Gagal mengambil daftar tenant:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil daftar masjid',
        });
    }
}
// Mengambil detail satu masjid
export function getTenantById(req, res) {
    try {
        const tenantId = getSingleRouteParam(req.params.tenantId);
        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID tidak valid',
            });
        }
        const result = db.exec(`
        SELECT
          tenant_id AS tenantId,
          mosque_name AS mosqueName,
          mosque_address AS mosqueAddress,
          logo_url AS logoUrl,
          background_url AS backgroundUrl,
          status,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM tenants
        WHERE tenant_id = ?
        LIMIT 1
      `, [tenantId]);
        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Masjid tidak ditemukan',
            });
        }
        const columns = result[0].columns;
        const row = result[0].values[0];
        const tenant = Object.fromEntries(columns.map((column, index) => [column, row[index]]));
        return res.status(200).json({
            success: true,
            data: tenant,
        });
    }
    catch (error) {
        console.error('Gagal mengambil detail tenant:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data masjid',
        });
    }
}

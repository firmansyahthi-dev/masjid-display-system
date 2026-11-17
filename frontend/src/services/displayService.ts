
import type { DisplayConfig } from '../types/display';

interface DisplayApiResponse {
  success: boolean;
  data?: DisplayConfig;
  message?: string;
}

export async function getDisplayConfig(
  tenantId: string
): Promise<DisplayConfig> {
  const response = await fetch(
    `/api/display/${encodeURIComponent(tenantId)}`
  );

  const result: DisplayApiResponse = await response.json();

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || 'Gagal mengambil konfigurasi Display'
    );
  }

  return result.data;
}

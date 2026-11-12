import Constants from 'expo-constants';

type ExtraConfig = {
  playStoreUrl?: string;
  apiBaseUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

/** Set after Play listing goes live */
export const PLAY_STORE_URL =
  extra.playStoreUrl?.trim() ||
  process.env.EXPO_PUBLIC_PLAY_STORE_URL?.trim() ||
  '';

/**
 * Published PHP proxy on meensou.com.
 * Upload server/utkal_api.php + server/api_config.php to this path.
 */
export const API_BASE_URL =
  extra.apiBaseUrl?.trim() ||
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  'https://meensou.com/myclimate/app/beneficiary/api/utkal_api.php';

export function weatherApiUrl(lat: string | number, lon: string | number): string {
  return `${API_BASE_URL}?action=weather&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`;
}

export function forecastApiUrl(lat: string | number, lon: string | number): string {
  return `${API_BASE_URL}?action=forecast&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`;
}

export function newsApiUrl(query = 'Odisha agriculture'): string {
  return `${API_BASE_URL}?action=news&q=${encodeURIComponent(query)}`;
}

import Constants from 'expo-constants';

type AppExtra = { apiBaseUrl?: string };

const extra = (Constants.expoConfig?.extra ?? {}) as AppExtra;

export const API_BASE_URL = extra.apiBaseUrl || 'http://127.0.0.1:8787'; // fallback (local)

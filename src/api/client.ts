import { validateApiBaseUrl, validateHttpResponse } from '../validators/api.validator.js';

// Ejemplo reutilizable para una futura tool que necesite consumir APIs HTTP.
export async function getFromApi<T>(path: string): Promise<T> {
  const baseUrl = process.env.API_BASE_URL;
  validateApiBaseUrl(baseUrl);
  const url = new URL(path.replace(/^\/+/, ''), baseUrl.endsWith('/') ? baseUrl : baseUrl + '/');
  const headers: Record<string, string> = {};
  if (process.env.API_TOKEN) headers.Authorization = `Bearer ${process.env.API_TOKEN}`;
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  validateHttpResponse(response, `Error consultando ${url.pathname}`);
  return await response.json() as T;
}

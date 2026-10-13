export function validateApiBaseUrl(value: string | undefined): asserts value is string {
  if (!value) throw new Error('Falta API_BASE_URL en .env');
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('API_BASE_URL debe ser HTTP(S)');
}

export function validateHttpResponse(response: Response, message: string): void {
  if (!response.ok) throw new Error(`${message}: HTTP ${response.status}`);
}

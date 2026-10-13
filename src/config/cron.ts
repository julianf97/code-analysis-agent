import cron from 'node-cron';

export const AGENT_CRON_ENABLED = process.env.AGENT_CRON_ENABLED === 'true';
export const AGENT_CRON = process.env.AGENT_CRON?.trim() || '0 18 * * *';
export const AGENT_TIMEZONE = process.env.AGENT_TIMEZONE?.trim() || 'America/Argentina/Buenos_Aires';

if (AGENT_CRON_ENABLED) {
  if (!cron.validate(AGENT_CRON)) throw new Error('AGENT_CRON inválido');
  try { new Intl.DateTimeFormat('es-AR', { timeZone: AGENT_TIMEZONE }).format(); }
  catch { throw new Error('AGENT_TIMEZONE inválido'); }
}

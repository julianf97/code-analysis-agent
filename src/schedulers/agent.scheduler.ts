import cron from 'node-cron';
import { AGENT_CRON, AGENT_TIMEZONE } from '../config/cron.js';
import { runAgentJob } from '../jobs/agent.job.js';

export function startAgentScheduler(): void {
  cron.schedule(AGENT_CRON, async () => {
    console.log(`[${new Date().toISOString()}] Iniciando agente...`);
    try {
      await runAgentJob();
      console.log('Ejecución finalizada.');
    } catch (error: unknown) {
      console.error('Error ejecutando el agente:', error);
    }
  }, { timezone: AGENT_TIMEZONE, noOverlap: true });
  console.log(`Agente programado: ${AGENT_CRON} (${AGENT_TIMEZONE})`);
}

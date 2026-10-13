import 'dotenv/config';
import { AGENT_CRON_ENABLED } from './config/cron.js';
import { startAgentScheduler } from './schedulers/agent.scheduler.js';
import { runAgentJob } from './jobs/agent.job.js';

if (AGENT_CRON_ENABLED) {
  startAgentScheduler();
} else {
  runAgentJob().catch((error: unknown) => {
    console.error('Error ejecutando el agente:', error);
    process.exitCode = 1;
  });
}

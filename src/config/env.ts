import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url().refine(value => value.startsWith('postgres://') || value.startsWith('postgresql://')),
  ADMIN_API_KEY: z.string().min(32),
  GITHUB_TOKEN: z.string().min(10),
  OPENAI_API_KEY: z.string().min(10),
  OPENAI_MODEL_FAST: z.string().min(1).default('gpt-4.1-mini'),
  OPENAI_MODEL_REASONING: z.string().min(1).default('gpt-4.1'),
  OPENAI_MODEL_REPORT: z.string().min(1).default('gpt-4.1-mini'),
  MAX_CONCURRENT_JOBS: z.coerce.number().int().min(1).max(10).default(1),
  MAX_PARALLEL_ANALYZERS: z.coerce.number().int().min(1).max(8).default(2),
  MAX_GITHUB_REQUESTS: z.coerce.number().int().min(1).max(16).default(3),
  MAX_OPENAI_REQUESTS: z.coerce.number().int().min(1).max(8).default(2),
  GLOBAL_BUDGET_USD: z.coerce.number().positive().default(10),
  DEFAULT_ANALYSIS_BUDGET_USD: z.coerce.number().positive().default(1),
  WORKER_POLL_MS: z.coerce.number().int().min(1000).max(60000).default(5000),
});

export type Environment = z.infer<typeof environmentSchema>;

export function loadEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  return environmentSchema.parse(source);
}

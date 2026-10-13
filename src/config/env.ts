import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DB_HOST: z.string().min(1).default('localhost'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_SCHEMA: z.string().min(1).default('public'),
  DB_TEST_SCHEMA: z.string().min(1).default('code_analysis_test'),
  DB_USE_TEST_SCHEMA: z.enum(['true', 'false']).default('false'),
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
});

export type Environment = z.infer<typeof envSchema>;

export function loadEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  return envSchema.parse(source);
}

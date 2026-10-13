import { z } from 'zod';

export const registerRepositorySchema = z.object({
  owner: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/),
}).strict();

export const repositoryIdSchema = z.uuid();

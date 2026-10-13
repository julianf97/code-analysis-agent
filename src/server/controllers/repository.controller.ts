import type { RequestHandler } from 'express';
import {
  getRepositoryById,
  listRepositories,
  registerRepository,
} from '../services/repository.service.js';
import { registerRepositorySchema, repositoryIdSchema } from '../validators/repository.validator.js';

export const createRepository: RequestHandler = async (req, res) => {
  const data = registerRepositorySchema.parse(req.body);
  const repository = await registerRepository(data);
  res.status(201).json({ data: repository });
};

export const listRepositoriesController: RequestHandler = async (_req, res) => {
  res.status(200).json({ data: await listRepositories() });
};

export const getRepositoryController: RequestHandler = async (req, res) => {
  const id = repositoryIdSchema.parse(req.params.id);
  res.status(200).json({ data: await getRepositoryById(id) });
};

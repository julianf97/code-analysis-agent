import type { RequestHandler } from 'express';
import { registerRepositorySchema, repositoryIdSchema } from '../validators/repository.validator.js';
import { RepositoryService } from '../services/repository.service.js';

export class RepositoryController {
  constructor(private readonly service = new RepositoryService()) {}

  create: RequestHandler = async (req, res) => {
    const input = registerRepositorySchema.parse(req.body);
    const repository = await this.service.register(input);
    res.status(201).json({ data: repository });
  };

  list: RequestHandler = async (_req, res) => {
    res.json({ data: await this.service.list() });
  };

  detail: RequestHandler = async (req, res) => {
    const id = repositoryIdSchema.parse(req.params.id);
    res.json({ data: await this.service.find(id) });
  };
}

import { tool } from 'langchain';
import { z } from 'zod';

// Tool de demostración: no necesita una API externa.
export const getCurrentDateTool = tool(
  async () => JSON.stringify({ now: new Date().toISOString() }),
  {
    name: 'get_current_date',
    description: 'Obtiene la fecha y hora actual en formato ISO 8601.',
    schema: z.object({}),
  },
);

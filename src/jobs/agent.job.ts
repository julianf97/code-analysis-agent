import { createAppAgent } from '../agents/agent.js';
import { AGENT_TASK } from '../config/agent.js';

export async function runAgentJob(): Promise<void> {
  const agent = createAppAgent();
  const result = await agent.invoke(
    { messages: [{ role: 'user', content: AGENT_TASK }] },
    { recursionLimit: 20 },
  );

  for (const message of result.messages) {
    if ('tool_calls' in message && message.tool_calls?.length) {
      console.dir(message.tool_calls, { depth: null });
    }
  }
  console.log('Resultado del agente:');
  console.dir(result.messages.at(-1)?.content, { depth: null });
}

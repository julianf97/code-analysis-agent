import { createAgent } from 'langchain';
import { createModel } from '../config/model.js';
import { createAgentTools } from '../tools/index.js';
import { AGENT_SYSTEM_PROMPT } from '../prompts/agent.prompt.js';

export function createAppAgent() {
  return createAgent({
    model: createModel(),
    tools: createAgentTools(),
    systemPrompt: AGENT_SYSTEM_PROMPT,
  });
}

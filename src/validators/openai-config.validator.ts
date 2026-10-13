export function validateOpenAiConfig(
  key: string | undefined,
  model: string | undefined,
): asserts key is string {
  if (!key || !model) throw new Error('Configurá OPENAI_API_KEY y OPENAI_MODEL en .env');
}

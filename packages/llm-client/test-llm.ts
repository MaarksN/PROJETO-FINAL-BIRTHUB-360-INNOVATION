// [SOURCE] CI-TS-003
import { GeminiClient } from './src/index';

async function main() {
  console.log('Testing LLM Client instantiation...');
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('Skipping LLM generation test: GEMINI_API_KEY not found');
      return;
    }

    const client = new GeminiClient(apiKey);
    console.log('GeminiClient instantiated successfully.');

    try {
        const response = await client.chat([
          { role: "user", content: "Hello, are you working?" },
        ]);
        console.log('Gemini Response:', response);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Gemini API call failed:', message);
    }
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

main();

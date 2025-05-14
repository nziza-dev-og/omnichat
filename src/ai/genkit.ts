import {genkit} from 'genkit';

// Configure Genkit with no default plugins or model,
// as flows will use specific SDKs like OpenAI directly.
export const ai = genkit({
  plugins: [],
});

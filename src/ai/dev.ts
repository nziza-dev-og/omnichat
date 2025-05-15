import { config } from 'dotenv';
config();

import '@/ai/flows/select-llm.ts'; // This flow might be obsolete or need update if not used
import '@/ai/flows/code-generation.ts';
import '@/ai/flows/context-handling.ts';
import '@/ai/flows/image-generation.ts'; // Added new image generation flow

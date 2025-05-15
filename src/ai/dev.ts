
import { config } from 'dotenv';
config();

import '@/ai/flows/select-llm.ts'; // This flow might be obsolete or need update if not used
import '@/ai/flows/code-generation.ts';
import '@/ai/flows/context-handling.ts';
import '@/ai/flows/image-generation.ts';
import '@/ai/flows/text-to-speech-flow.ts'; // Added new text-to-speech flow

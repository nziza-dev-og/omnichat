import { config } from 'dotenv';
config();

import '@/ai/flows/select-llm.ts';
import '@/ai/flows/code-generation.ts';
import '@/ai/flows/context-handling.ts';
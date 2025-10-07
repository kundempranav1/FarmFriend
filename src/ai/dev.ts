'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-crop-problem.ts';
import '@/ai/flows/answer-questions-with-chatbot.ts';
import '@/ai/flows/analyze-soil-health.ts';
import '@/ai/flows/predict-season.ts';

import type { Prompt } from "../models/prompt.model";
import promptsData from "./prompts.json";

const prompts = promptsData as Prompt[];
const TOTAL_PROMPTS = prompts.length;

/**
 * Load a single prompt by ID
 */
export const loadPromptById = (id: number): Prompt | undefined => {
  return prompts.find((prompt) => prompt.id === id);
};

/**
 * Get the total number of available prompts
 */
export const getTotalPrompts = (): number => {
  return TOTAL_PROMPTS;
};

/**
 * Get the next prompt ID (wraps around to 1 after the last prompt)
 */
export const getNextPromptId = (currentId: number): number => {
  return currentId >= TOTAL_PROMPTS ? 1 : currentId + 1;
};

/**
 * Get the previous prompt ID (wraps around to last prompt when at first)
 */
export const getPreviousPromptId = (currentId: number): number => {
  return currentId <= 1 ? TOTAL_PROMPTS : currentId - 1;
};

/**
 * Get a random prompt ID
 * When current is passed in, will ensure it's different from the current ID.
 */
export const getRandomPromptId = (current?: number): number => {
  let randomId: number;
  do {
    randomId = Math.floor(Math.random() * TOTAL_PROMPTS) + 1;
  } while (randomId === current);
  return randomId;
};

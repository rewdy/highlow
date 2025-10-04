/**
 * Represents the intensity/depth level of a conversation prompt
 */
export type PromptCategory = "lighthearted" | "reflective" | "deep";

/**
 * A conversation prompt to help facilitate better discussions
 */
export type Prompt = {
  id: number;
  question: string;
  category: PromptCategory;
  tags?: string[];
};

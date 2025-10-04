import matter from "gray-matter";
import type { Prompt, PromptCategory } from "~/models/prompt.model";

// Import all markdown files from the prompts directory
// Vite will handle these as raw strings
const promptFiles = import.meta.glob("../prompts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * Load and parse all prompt markdown files into Prompt objects
 */
const loadPrompts = (): Prompt[] => {
  const loadedPrompts: Prompt[] = [];

  // Process each markdown file
  Object.entries(promptFiles).forEach(([filepath, content]) => {
    // Extract the numeric ID from filename (e.g., "001.md" -> 1)
    const filename = filepath.split("/").pop() || "";
    const id = parseInt(filename.replace(/\.md$/, ""), 10);

    if (isNaN(id)) {
      console.warn(`Skipping file with invalid ID: ${filename}`);
      return;
    }

    // Parse frontmatter and content
    const { data, content: question } = matter(content as string);

    loadedPrompts.push({
      id,
      question: question.trim(),
      category: data.category as PromptCategory,
      tags: data.tags as string[] | undefined,
    });
  });

  // Sort by ID to ensure consistent order
  return loadedPrompts.sort((a, b) => a.id - b.id);
};

/**
 * Collection of conversation prompts ranging from lighthearted to deep
 */
export const prompts: Prompt[] = loadPrompts();

/**
 * Get a prompt by its ID
 */
export const getPromptById = (id: number): Prompt | undefined => {
  return prompts.find((prompt) => prompt.id === id);
};

/**
 * Get the next prompt ID (wraps around to 1 after the last prompt)
 */
export const getNextPromptId = (currentId: number): number => {
  const currentIndex = prompts.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) return 1;
  return currentIndex === prompts.length - 1 ? 1 : prompts[currentIndex + 1].id;
};

/**
 * Get the previous prompt ID (wraps around to last prompt when at first)
 */
export const getPreviousPromptId = (currentId: number): number => {
  const currentIndex = prompts.findIndex((p) => p.id === currentId);
  if (currentIndex === -1) return prompts[prompts.length - 1].id;
  return currentIndex === 0
    ? prompts[prompts.length - 1].id
    : prompts[currentIndex - 1].id;
};

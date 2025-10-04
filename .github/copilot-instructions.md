# Copilot Instructions for HighLow

## Project Overview

This is a **conversation prompts app** that helps users have better and deeper conversations. The app presents thought-provoking questions that range from light-hearted and fun to deeper and more reflective topics.

**Tech Stack:**
- React Router v7 (with SSR)
- TypeScript
- React 19
- Custom CSS (no Tailwind)
- Bun for package management

---

## Code Style & Conventions

### TypeScript

- **Always use `type` over `interface`** unless an interface is required for a class
- All exported functions must have TSDoc comments describing what they do
- Do NOT include parameter types in TSDoc (TypeScript handles that)
- Types are self-documenting; avoid redundant comments

### React Components

- Use **functional components only**
- Use **hooks liberally** to separate logic when it makes sense
- Prefer **named exports** over default exports (except when React Router requires default exports for routes)
- Use **arrow functions** over function declarations

### File Naming & Organization

#### Components
- **Location:** `app/components/`
- **File naming:** `ComponentName.tsx` (PascalCase)
- **Props naming:** `ComponentNameProps` type
  - Keep props type above the component if few props
  - Move to `ComponentName.props.ts` when many props exist
- **Example:**
  ```typescript
  // app/components/PromptCard.tsx
  type PromptCardProps = {
    title: string;
    category: 'lighthearted' | 'reflective' | 'deep';
  };

  export const PromptCard = ({ title, category }: PromptCardProps) => {
    // component code
  };
  ```

#### Hooks
- **Location:** `app/hooks/`
- **File naming:** `useSomething.ts`
- **Example:** `app/hooks/useRandomPrompt.ts`

#### Types/Models
- **Location:** `app/models/`
- **File naming:** `group.model.ts` (where "group" describes the grouping)
- **Example:** `app/models/prompt.model.ts`, `app/models/user.model.ts`

#### Helpers
- **Location:** `app/helpers/` (when it makes sense to group them)
- **File naming:** `name.helpers.ts`
- **Example:** `app/helpers/prompt.helpers.ts`

#### Barrel Exports
- **DO NOT use `index.ts` barrel export files** - they slow down compilation times
- Import directly from source files

### CSS & Styling

- **DO NOT use Tailwind CSS**
- Write custom CSS (often minimal)
- Keep styles in `.css` files
- If layout gets complex, ask before recommending a CSS library
- Component styles can go in `ComponentName.css` adjacent to the component

### State Management

- Use React Router loaders/actions for data fetching
- Use React hooks (useState, useReducer, useContext) for local state
- If additional state management is needed, use **Jotai** (not Redux, Zustand, etc.)

### Accessibility

- **Prioritize accessibility** - accessible UIs are better UIs
- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain proper heading hierarchy

### Comments & Documentation

- **TSDoc comments required** for all exported functions
- Keep code **self-documenting** when possible - avoid obvious comments
- Add **step-by-step comments** for complex/complicated logic to help future engineers
- Comments can be fun, but **readability is #1 priority**

---

## Project-Specific Guidelines

### Conversation Prompts

When generating or working with prompts:
- Ensure variety in tone (lighthearted → reflective → deep)
- Questions should be open-ended and thought-provoking
- Consider different contexts (friends, family, dates, team building, etc.)
- Prompts should encourage meaningful dialogue, not yes/no answers

### Data Modeling

Example prompt structure (adjust as needed):
```typescript
type Prompt = {
  id: string;
  question: string;
  category: 'lighthearted' | 'reflective' | 'deep';
  tags?: string[];
};
```

---

## Developer Context

**Experience Level:** Staff-level engineer with 5+ years React experience and many years of frontend development.

**Preferences:**
- Fun and engaging code is good, but clarity comes first
- Assume strong TypeScript/React knowledge
- No need to explain basic concepts
- Focus on idiomatic, modern React patterns
- Performance matters, but premature optimization doesn't

---

## Examples

### ✅ Good Component Structure

```typescript
// app/components/PromptDisplay.tsx

/**
 * Displays a conversation prompt with category styling
 */
export const PromptDisplay = ({ prompt, onNext }: PromptDisplayProps) => {
  const categoryClass = getCategoryClass(prompt.category);
  
  return (
    <div className={`prompt-display ${categoryClass}`}>
      <h2>{prompt.question}</h2>
      <button onClick={onNext} aria-label="Get next prompt">
        Next Question
      </button>
    </div>
  );
};

type PromptDisplayProps = {
  prompt: Prompt;
  onNext: () => void;
};
```

### ✅ Good Hook Structure

```typescript
// app/hooks/usePromptRotation.ts

/**
 * Manages prompt rotation with configurable timing
 */
export const usePromptRotation = (prompts: Prompt[], intervalMs: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-rotate prompts at specified interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % prompts.length);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [prompts.length, intervalMs]);
  
  return prompts[currentIndex];
};
```

### ❌ Avoid

```typescript
// Don't use interfaces unless required
interface BadProps {
  title: string;
}

// Don't use default exports (except for routes)
export default function BadComponent() {}

// Don't use function declarations
function badFunction() {}

// Don't use Tailwind classes
<div className="flex items-center justify-between p-4 bg-blue-500" />

// Don't create barrel exports
// app/components/index.ts ❌
```

---

## Quick Reference

| Category | Convention |
|----------|------------|
| Components | `PascalCase.tsx` in `app/components/` |
| Hooks | `useSomething.ts` in `app/hooks/` |
| Types | `group.model.ts` in `app/models/` |
| Helpers | `name.helpers.ts` in `app/helpers/` |
| Exports | Named exports (except routes) |
| Functions | Arrow functions |
| Types | `type` over `interface` |
| Styling | Custom CSS, no Tailwind |
| State | React hooks + Jotai if needed |
| Comments | TSDoc for exports, minimal elsewhere |

---

*Remember: Readability first, fun second, but both are important!* 🚀

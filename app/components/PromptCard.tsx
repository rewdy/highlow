import { Link } from "react-router";
import type { Prompt } from "~/models/prompt.model";

type PromptCardProps = {
  prompt: Prompt;
};

/**
 * Displays a conversation prompt in a card format
 */
export const PromptCard = ({ prompt }: PromptCardProps) => {
  return (
    <div className={`prompt-card prompt-card--${prompt.category}`}>
      <div className="prompt-card__content">
        <span className="prompt-card__category">{prompt.category}</span>
        <h2 className="prompt-card__question">{prompt.question}</h2>
      </div>
    </div>
  );
};

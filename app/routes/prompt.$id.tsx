import { useLoaderData, useNavigate, Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import type { Route } from "./+types/prompt.$id";
import {
  getPromptById,
  getNextPromptId,
  getPreviousPromptId,
} from "~/data/prompts";
import { PromptCard } from "~/components/PromptCard";
import { useSwipe } from "~/hooks/useSwipe";
import "~/components/PromptCard.css";
import "./prompt.$id.css";

/**
 * Load the prompt data for the given ID
 */
export const loader = ({ params }: Route.LoaderArgs) => {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    throw new Response("Invalid prompt ID", { status: 400 });
  }

  const prompt = getPromptById(id);

  if (!prompt) {
    throw new Response("Prompt not found", { status: 404 });
  }

  const nextId = getNextPromptId(id);
  const previousId = getPreviousPromptId(id);

  return { prompt, nextId, previousId };
};

type TransitionState = "idle" | "exiting" | "entering";

/**
 * Display a single prompt in a card format with swipe navigation
 */
export default function PromptRoute() {
  const { prompt, nextId, previousId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [transitionState, setTransitionState] =
    useState<TransitionState>("entering");
  const [exitDirection, setExitDirection] = useState<"up" | "down" | null>(
    null,
  );
  const previousPromptId = useRef(prompt.id);

  // Detect when prompt changes and trigger enter animation
  useEffect(() => {
    if (previousPromptId.current !== prompt.id) {
      setTransitionState("entering");
      // Reset to idle after animation completes
      const timer = setTimeout(() => {
        setTransitionState("idle");
        previousPromptId.current = prompt.id;
      }, 400);
      return () => clearTimeout(timer);
    } else {
      // Initial load
      const timer = setTimeout(() => {
        setTransitionState("idle");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [prompt.id]);

  const handleNavigation = (direction: "up" | "down", targetId: number) => {
    setExitDirection(direction);
    setTransitionState("exiting");
    // Navigate after exit animation starts
    setTimeout(() => {
      navigate(`/prompt/${targetId}`);
    }, 300);
  };

  // Handle swipe gestures
  const { swipeDirection, swipeProgress, bind } = useSwipe({
    onSwipeUp: () => {
      if (transitionState === "idle") {
        handleNavigation("up", nextId);
      }
    },
    onSwipeDown: () => {
      if (transitionState === "idle") {
        handleNavigation("down", previousId);
      }
    },
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (transitionState !== "idle") return;

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleNavigation("down", previousId);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        handleNavigation("up", nextId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transitionState, nextId, previousId]);

  // Calculate transform based on swipe progress OR transition state
  const getTransform = () => {
    // During transition animations
    if (transitionState === "exiting" && exitDirection) {
      const direction = exitDirection === "up" ? -1 : 1;
      return `translateY(${direction * 100}vh) scale(0.8)`;
    }

    if (transitionState === "entering") {
      // Enter from opposite direction of exit
      // Since we don't track the previous exit direction, we'll come from bottom by default
      return "translateY(0) scale(1)";
    }

    // During active swipe
    if (swipeDirection && swipeProgress > 0) {
      const direction = swipeDirection === "up" ? -1 : 1;
      const offset = swipeProgress * 100; // More dramatic movement
      const scale = 1 - swipeProgress * 0.1; // Slight scale down
      return `translateY(${direction * offset}px) scale(${scale})`;
    }

    return "translateY(0) scale(1)";
  };

  const getOpacity = () => {
    if (transitionState === "exiting") return 0;
    if (transitionState === "entering") return 1;
    if (swipeProgress > 0) return 1 - swipeProgress * 0.4;
    return 1;
  };

  const getCardClass = () => {
    const classes = ["prompt-view__card-wrapper"];
    if (transitionState === "exiting")
      classes.push("prompt-view__card-wrapper--exiting");
    if (transitionState === "entering") {
      classes.push("prompt-view__card-wrapper--entering");
      // Determine entry direction based on exit direction
      if (exitDirection === "up") {
        classes.push("prompt-view__card-wrapper--entering-from-bottom");
      } else {
        classes.push("prompt-view__card-wrapper--entering-from-top");
      }
    }
    return classes.join(" ");
  };

  return (
    <>
      {/* Site branding - positioned absolutely, outside swipe container */}
      <a href="/" className="prompt-view__branding">
        <span className="prompt-view__branding-high">high</span>
        <span className="prompt-view__branding-slash">/</span>
        <span className="prompt-view__branding-low">low</span>
      </a>

      <div className="prompt-view" {...bind}>
        {/* Previous prompt button (appears above card) */}
        <button
          className="prompt-view__nav prompt-view__nav--previous"
          onClick={() => handleNavigation("down", previousId)}
          disabled={transitionState !== "idle"}
          aria-label="Previous prompt"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        <div
          className={getCardClass()}
          style={{
            transform: getTransform(),
            opacity: getOpacity(),
          }}
        >
          <PromptCard prompt={prompt} />
        </div>

        {/* Next prompt button (appears below card) */}
        <button
          className="prompt-view__nav prompt-view__nav--next"
          onClick={() => handleNavigation("up", nextId)}
          disabled={transitionState !== "idle"}
          aria-label="Next prompt"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Swipe hint indicator */}
        <div className="prompt-view__hint">Swipe</div>
      </div>
    </>
  );
}

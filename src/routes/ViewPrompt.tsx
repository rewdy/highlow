import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { PromptBranding } from "../components/Branding";
import { CustomToggle } from "../components/CustomToggle";
import { PromptCard } from "../components/PromptCard";
import { PromptNavButton } from "../components/PromptNavButton";
import {
  getNextPromptId,
  getPreviousPromptId,
  getRandomPromptId,
  loadPromptById,
} from "../data/prompts";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useSwipe } from "../hooks/useSwipe";
import type { Prompt } from "../models/prompt.model";
import "./ViewPrompt.css";

type TransitionState = "idle" | "exiting" | "entering" | "loading";

/**
 * Display a single prompt in a card format with swipe navigation
 */
export function PromptRoute() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const [swipeRandom, setSwipeRandom] = useLocalStorageState(
    "swipeRandom",
    false,
  );

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transitionState, setTransitionState] =
    useState<TransitionState>("loading");
  const [exitDirection, setExitDirection] = useState<"up" | "down" | null>(
    null,
  );
  const previousPromptIds = useRef<number[]>([]);

  // Parse ID from params
  const id = params.id ? Number.parseInt(params.id, 10) : undefined;

  // Calculate next/previous IDs
  const nextSequentialId = prompt ? getNextPromptId(prompt.id) : 1;
  const previousSequentialId = prompt ? getPreviousPromptId(prompt.id) : 1;
  const randomNextId = getRandomPromptId(id);

  const nextId = swipeRandom ? randomNextId : nextSequentialId;
  const previousId = previousPromptIds.current.at(-1) ?? previousSequentialId;

  const handleNavigation = useCallback(
    (direction: "up" | "down", targetId: number) => {
      setExitDirection(direction);
      setTransitionState("exiting");

      // When navigating forward, add current prompt to history
      if (direction === "up" && id) {
        previousPromptIds.current.push(id);
      }

      // When navigating backward, pop from history
      if (direction === "down" && previousPromptIds.current.length > 0) {
        previousPromptIds.current.pop();
      }

      // Navigate after exit animation starts
      setTimeout(() => {
        navigate(`/prompt/${targetId}`);
      }, 300);
    },
    [navigate, id],
  );

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

  // Load prompt data when ID changes
  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setError("Invalid prompt ID");
      setTransitionState("idle");
      return;
    }

    setTransitionState("loading");
    setError(null);

    const loadedPrompt = loadPromptById(id);
    if (!loadedPrompt) {
      setError("Prompt not found");
      setTransitionState("idle");
    } else {
      setPrompt(loadedPrompt);
      setTransitionState("entering");

      // Reset to idle after animation completes
      const timer = setTimeout(() => {
        setTransitionState("idle");
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [id]);

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
  }, [transitionState, nextId, previousId, handleNavigation]);

  // Show error state
  if (error) {
    return (
      <div className="prompt-view">
        <div className="prompt-view__error">
          <h2>{error}</h2>
          <a href="/" className="prompt-view__error-link">
            Return home
          </a>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!prompt || transitionState === "loading") {
    return (
      <div className="prompt-view">
        <div className="prompt-view__loading">Loading prompt...</div>
      </div>
    );
  }

  // Calculate transform based on swipe progress OR transition state
  const getTransform = () => {
    // During transition animations
    if (transitionState === "exiting" && exitDirection) {
      const direction = exitDirection === "up" ? -1 : 1;
      return `translateY(${direction * 100}vh) scale(0.8)`;
    }

    if (transitionState === "entering") {
      return "translateY(0) scale(1)";
    }

    // During active swipe
    if (swipeDirection && swipeProgress > 0) {
      const direction = swipeDirection === "up" ? -1 : 1;
      const offset = swipeProgress * 100;
      const scale = 1 - swipeProgress * 0.1;
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
      <header className="prompt-view__header">
        <div>
          <PromptBranding />
        </div>

        <div className="prompt-view__settings">
          <CustomToggle
            checked={swipeRandom}
            onChange={setSwipeRandom}
            label="Random"
          />
        </div>
      </header>

      <div className="prompt-view" {...bind}>
        <PromptNavButton
          direction="down"
          onClick={() => handleNavigation("down", previousId)}
          disabled={transitionState !== "idle"}
        />

        <div
          className={getCardClass()}
          style={{
            transform: getTransform(),
            opacity: getOpacity(),
          }}
        >
          <PromptCard prompt={prompt} />
        </div>

        <PromptNavButton
          direction="up"
          onClick={() => handleNavigation("up", nextId)}
          disabled={transitionState !== "idle"}
        />

        <div className="prompt-view__hint">Swipe</div>
      </div>
    </>
  );
}

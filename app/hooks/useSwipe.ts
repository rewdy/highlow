import { useEffect, useRef, useState } from "react";
import type { TouchEvent, MouseEvent } from "react";

type SwipeDirection = "up" | "down" | null;

type SwipeHandlers = {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
};

type UseSwipeResult = {
  swipeDirection: SwipeDirection;
  swipeProgress: number; // 0 to 1, how far through the swipe
  bind: {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: () => void;
  };
};

const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger a swipe
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity to trigger swipe

/**
 * Hook for detecting vertical swipe gestures (touch and mouse)
 * Returns swipe direction, progress, and event handlers to bind to an element
 */
export const useSwipe = (handlers: SwipeHandlers): UseSwipeResult => {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const startY = useRef(0);
  const currentY = useRef(0);
  const startTime = useRef(0);
  const isDragging = useRef(false);

  // Reset swipe state
  const resetSwipe = () => {
    setSwipeDirection(null);
    setSwipeProgress(0);
    isDragging.current = false;
  };

  // Handle start of swipe (touch or mouse)
  const handleStart = (clientY: number) => {
    startY.current = clientY;
    currentY.current = clientY;
    startTime.current = Date.now();
    isDragging.current = true;
  };

  // Handle movement during swipe
  const handleMove = (clientY: number) => {
    if (!isDragging.current) return;

    currentY.current = clientY;
    const deltaY = currentY.current - startY.current;

    // Calculate progress (capped at 1.5 for overscroll effect)
    const progress = Math.min(Math.abs(deltaY) / 300, 1.5);
    setSwipeProgress(progress);

    // Determine direction
    if (Math.abs(deltaY) > 10) {
      setSwipeDirection(deltaY < 0 ? "up" : "down");
    }
  };

  // Handle end of swipe
  const handleEnd = () => {
    if (!isDragging.current) return;

    const deltaY = currentY.current - startY.current;
    const deltaTime = Date.now() - startTime.current;
    const velocity = Math.abs(deltaY) / deltaTime;

    // Check if swipe meets threshold requirements
    const meetsThreshold =
      Math.abs(deltaY) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD;

    if (meetsThreshold) {
      if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      } else if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      }
    }

    resetSwipe();
  };

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers
  const onMouseDown = (e: MouseEvent) => {
    handleStart(e.clientY);
  };

  const onMouseMove = (e: MouseEvent) => {
    handleMove(e.clientY);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetSwipe();
    };
  }, []);

  return {
    swipeDirection,
    swipeProgress,
    bind: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
    },
  };
};

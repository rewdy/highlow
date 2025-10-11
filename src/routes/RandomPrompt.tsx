import type React from "react";
import { Redirect } from "wouter";
import { getTotalPrompts } from "../data/prompts";

const getRandomIntInclusive = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

/**
 * Route that redirects to a random prompt
 */
export const RandomPromptRoute: React.FC = () => {
  const totalPrompts = getTotalPrompts();
  const randomId = getRandomIntInclusive(1, totalPrompts);

  return <Redirect to={`/prompt/${randomId}`} />;
};

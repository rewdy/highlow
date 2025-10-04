import { redirect } from "react-router";
import type { Route } from "../+types/root";

/**
 * Catch-all route that redirects to home
 */
export const loader = ({}: Route.LoaderArgs) => {
  return redirect("/");
};

export default function CatchAll() {
  return null;
}

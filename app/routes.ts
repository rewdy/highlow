import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("prompt/:id", "routes/prompt.$id.tsx"),
  route("*", "routes/$.tsx"), // Catch-all route redirects to home
] satisfies RouteConfig;

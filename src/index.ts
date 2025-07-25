import { Hono } from "hono";
import type { AuthType } from "./lib/auth"
import auth from "./routes/auth";
import { logger } from "hono/logger";

const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

app.use("*", logger());

const routes = [auth] as const;

routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

export default app;
import { router } from "../trpc";
import { authRouter } from "./auth";
import { documentRouter } from "./document";
import { analysisRouter } from "./analysis";
import { notificationRouter } from "./notification";

export const appRouter = router({
  auth: authRouter,
  document: documentRouter,
  analysis: analysisRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;

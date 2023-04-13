import { createTRPCRouter } from "~/server/api/trpc";
import { postsRouter } from "./routers/post";
import { usersRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  user: usersRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

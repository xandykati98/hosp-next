import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/user";
import { homeRouter } from "./routers/home";
import { imovelRouter } from "./routers/imovel"
import { empresaRouter } from "./routers/empresa"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: usersRouter,
  home: homeRouter,
  imovel: imovelRouter,
  empresa: empresaRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

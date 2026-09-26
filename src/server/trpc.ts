import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  const session = await auth();
  return {
    session,
    prisma,
    headers: opts?.resHeaders,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to perform this action" });
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          id: ctx.session.user.id as string,
        },
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

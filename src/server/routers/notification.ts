import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const notificationRouter = router({
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    // In our system, notifications can be stored in user preferences or JSON metadata
    return {
      emailOnAnalysisComplete: true,
      emailOnDocumentShare: true,
      pushOnAnalysisComplete: true,
      pushOnMention: true,
    };
  }),

  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailOnAnalysisComplete: z.boolean(),
        emailOnDocumentShare: z.boolean(),
        pushOnAnalysisComplete: z.boolean(),
        pushOnMention: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return { success: true, preferences: input };
    }),
});

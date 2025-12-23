import { z } from "zod";

export const createInviteSchema = z.object({
  email: z.email(),
  role: z.literal("MEMBER").optional()
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;

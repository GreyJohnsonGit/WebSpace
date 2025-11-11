import z from 'zod';

export type UserAccount = z.infer<typeof UserAccount>;
export const UserAccount = z.object({
  user_id: z.uuid(),
  user_name: z.string().max(50),
  user_email: z.email().max(100),
  user_created_at: z.coerce.date()
});
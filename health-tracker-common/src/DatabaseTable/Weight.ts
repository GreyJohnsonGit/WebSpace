import z from 'zod';

export type Weight = z.infer<typeof Weight>;
export const Weight = z.object({
  user_id: z.uuid(),
  weight_kg: z.coerce.number().positive(),
  weight_recorded_at: z.coerce.date()
});
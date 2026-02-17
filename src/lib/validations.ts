import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const messageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1).max(4000),
});

export const onboardingSchema = z.object({
  intent: z.enum(["growth", "career", "peace", "confidence"]),
  personaId: z.string().uuid(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

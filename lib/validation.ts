import { z } from "zod";

// Reserved slugs that can't be used as a page handle (they collide with app routes).
export const RESERVED_SLUGS = new Set([
  "dashboard",
  "login",
  "register",
  "api",
  "admin",
  "settings",
  "about",
  "_next",
  "favicon.ico",
]);

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Handle must be at least 3 characters")
  .max(32, "Handle must be at most 32 characters")
  .regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
    "Use lowercase letters, numbers and hyphens only"
  )
  .refine((s) => !RESERVED_SLUGS.has(s), "That handle is reserved");

export const registerSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const pageSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, "Title is required").max(80),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  avatarUrl: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  theme: z.string().min(1).max(40),
  published: z.boolean().optional(),
});

export const linkSchema = z.object({
  title: z.string().trim().min(1, "Label is required").max(80),
  url: z.string().trim().url("Enter a valid URL (include https://)").max(2000),
});

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

// Optional URL field that also accepts an empty string (cleared input).
const optionalUrl = (max = 500) =>
  z.string().trim().url("Enter a valid URL").max(max).optional().or(z.literal(""));

// Optional hex color (#rrggbb) that also accepts an empty string.
const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #ff0055")
  .optional()
  .or(z.literal(""));

// datetime-local form value -> Date | null.
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? new Date(v) : null))
  .refine((d) => d === null || !Number.isNaN(d.getTime()), "Invalid date");

export const pageSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, "Title is required").max(80),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  avatarUrl: optionalUrl(500),
  theme: z.string().min(1).max(40),
  published: z.boolean().optional(),
  // Appearance overrides
  accentColor: hexColor,
  customBg: hexColor,
  customBg2: hexColor,
  customText: hexColor,
  backgroundImageUrl: optionalUrl(800),
  buttonStyle: z.enum(["rounded", "pill", "square"]).optional(),
  fontFamily: z.enum(["sans", "serif", "mono", "rounded", "display"]).optional(),
  hideBranding: z.boolean().optional(),
  // Lead capture
  collectEmails: z.boolean().optional(),
  emailHeading: z.string().trim().max(120).optional().or(z.literal("")),
});

export const linkSchema = z.object({
  title: z.string().trim().min(1, "Label is required").max(80),
  url: z.string().trim().url("Enter a valid URL (include https://)").max(2000),
  thumbnailUrl: optionalUrl(800),
  featured: z.boolean().optional(),
  embedType: z.enum(["youtube", "spotify"]).optional().or(z.literal("")),
  startsAt: optionalDate,
  endsAt: optionalDate,
});

export const socialSchema = z.object({
  platform: z.string().trim().min(1).max(20),
  url: z.string().trim().min(1, "Enter a link or handle").max(500),
});

export const leadSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
});

import { z } from "zod";

export const talentCreateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    primarySkill: z.string().min(2, "Primary skill is required"),
    experience: z.number().min(0, "Experience cannot be negative").max(50, "Experience too high"),
    jobSite: z.enum(["Remote", "On-site", "Hybrid"]),
    description: z.string().min(20, "Bio must be at least 20 characters").max(1000, "Bio too long"),
  }),
});

export const talentUpdateSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    primarySkill: z.string().optional(),
    experience: z.number().min(0).optional(),
    jobSite: z.enum(["Remote", "On-site", "Hybrid"]).optional(),
    description: z.string().min(20).optional(),
    status: z.enum(["active", "inactive", "pending"]).optional(),
  }),
});

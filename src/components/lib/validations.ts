import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Name must be at least 2 characters"),
  industry: z
    .string()
    .min(1, "Industry is required"),
  location: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

export type CompanySchemaType = z.infer<typeof companySchema>;






//Internship Form Schema
export const internshipSchema = z.object({
  title: z
    .string()
    .min(1, "Internship title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  requirements: z
    .string()
    .min(1, "Requirements are required"),
});

export type InternshipInput = z.input<typeof internshipSchema>;
export type InternshipOutput = z.output<typeof internshipSchema>;

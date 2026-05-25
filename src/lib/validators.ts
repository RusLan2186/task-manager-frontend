import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Passed email is not valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Passed email is not valid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const projectCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters long" }),
});

export const projectUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, { message: "Title must be at least 3 characters long" })
      .optional(),
    description: z
      .string()
      .trim()
      .min(5, { message: "Description must be at least 5 characters long" })
      .optional(),
  })
  .refine(
    (value) => value.title !== undefined || value.description !== undefined,
    { message: "At least one field must be provided for update" },
  );

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const taskCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "Description must be at least 5 characters long" }),
  priority: z.nativeEnum(Priority, {
    message: "Priority must be one of: LOW, MEDIUM, HIGH",
  }),
  status: z
    .nativeEnum(Status, {
      message: "Status must be one of: TODO, IN_PROGRESS, DONE",
    })
    .optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
});

export const taskUpdateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, { message: "Title must be at least 3 characters long" })
      .optional(),
    description: z
      .string()
      .trim()
      .min(5, { message: "Description must be at least 5 characters long" })
      .optional(),
    priority: z
      .nativeEnum(Priority, {
        message: "Priority must be one of: LOW, MEDIUM, HIGH",
      })
      .optional(),
    status: z
      .nativeEnum(Status, {
        message: "Status must be one of: TODO, IN_PROGRESS, DONE",
      })
      .optional(),
    assigneeId: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.priority !== undefined ||
      value.status !== undefined ||
      value.assigneeId !== undefined,
    { message: "At least one field must be provided for update" },
  );

export const commentCreateSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: "Comment text cannot be empty" })
    .max(500, { message: "Comment text must not exceed 500 characters" }),
});

export type CommentCreate = z.infer<typeof commentCreateSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

import { z } from "zod";
import { fail } from "./auth";

/* Input checks for the admin panel's server functions. Documents are
 * checked for kind and size and then laid over their defaults, so a missing
 * field is filled rather than trusted, and an extra one is harmless: the
 * site renders only the fields it knows, and never as raw HTML. */

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Give it a web address (slug).")
  .max(80, "The web address is too long.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens.");

export const idSchema = z.string().trim().min(1).max(100);

const MAX_DOC_BYTES = 1_500_000;

export const docSchema = z
  .record(z.string(), z.unknown())
  .refine((doc) => JSON.stringify(doc).length <= MAX_DOC_BYTES, "This is too large to save.");

/** Parses with a schema, turning the first problem into a readable error. */
export function parse<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    fail(issue?.message ?? "That could not be saved.", 400);
  }
  return result.data;
}

/** Makes a validator for createServerFn().inputValidator(). */
export const input =
  <T>(schema: z.ZodType<T>) =>
  (value: unknown): T =>
    parse(schema, value);

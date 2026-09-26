/**
 * Stored content laid over the seed, so a field added to the site after a
 * page was last saved still has a value rather than rendering `undefined`.
 *
 * Objects merge key by key; anything else (strings, numbers, arrays) is taken
 * from the stored copy whole, so a list shortened in the admin stays short.
 */
export function withDefaults<T>(defaults: T, stored: unknown): T {
  if (stored === undefined || stored === null) return defaults;
  if (!isPlainObject(defaults) || !isPlainObject(stored)) {
    // A stored value of a different kind than the default is corrupt; keep the default.
    if (Array.isArray(defaults) !== Array.isArray(stored)) return defaults;
    if (typeof defaults !== typeof stored && defaults !== null) return defaults;
    return stored as T;
  }
  // Tagged unions (image references, article blocks) are one value, not a
  // record to merge into: an upload must not pick up the default's asset key.
  if ("kind" in defaults || "type" in defaults) return stored as T;
  const out: Record<string, unknown> = { ...stored };
  for (const [key, value] of Object.entries(defaults)) {
    out[key] = withDefaults(value, (stored as Record<string, unknown>)[key]);
  }
  return out as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

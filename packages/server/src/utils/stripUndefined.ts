/**
 * Firestore's update() rejects any field whose value is `undefined` (it can't tell "leave this
 * field alone" from "set it to undefined"), so a partial PATCH body's untouched optional fields
 * have to be dropped before being handed to Firestore rather than merely spread.
 */
export function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>
}

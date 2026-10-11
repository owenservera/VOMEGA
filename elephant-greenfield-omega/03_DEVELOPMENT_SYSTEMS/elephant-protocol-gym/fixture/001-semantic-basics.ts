/**
 * Elephant Protocol Gym — tiny conventional TypeScript fixture.
 *
 * Intentional research note: the claimed contract on repeat is NOT enforced.
 * This discrepancy exists so agents can discover how to distinguish
 * author's meaning from mechanically established or tested behavior.
 *
 * No semantic annotation syntax is prescribed.
 */

export const MAX_RETRIES = 3;

export function add(a: number, b: number): number {
  return a + b;
}

/** Declared expectation: count is a nonnegative safe integer. Not enforced. */
export function repeat(count: number, emit: (value: number) => void): void {
  for (let i = 0; i < count; i++) emit(i);
}

export function classify(value: number): "negative" | "zero" | "positive" {
  if (value < 0) return "negative";
  if (value === 0) return "zero";
  return "positive";
}

export function accumulate(values: number[]): number {
  let total = 0;
  for (const value of values) total = add(total, value);
  return total;
}

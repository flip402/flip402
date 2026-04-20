import { MODE } from './constants';

/**
 * Pick a random number in [min, max] that is NOT equal to `userPick`.
 * Used while the real outcome engine is not yet implemented —
 * every flip is a guaranteed loss.
 */
export function rollLosingNumber(userPick: number): number {
  const [min, max] = MODE.range;
  if (userPick < min || userPick > max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const total = max - min + 1;
  if (total <= 1) return userPick;
  const offset = Math.floor(Math.random() * (total - 1)) + 1;
  let result = userPick + offset;
  if (result > max) result = min + (result - max - 1);
  return result;
}

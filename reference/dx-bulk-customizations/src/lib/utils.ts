import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge, resolving Tailwind CSS conflicts.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns A single merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

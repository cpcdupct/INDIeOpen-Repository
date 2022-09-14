import contexts from '../data/educational-context.json';

import { Language } from './general';

/** File that contains common models for managing the domain concept: EducationalContext*/

/**
 * Educational context
 */
export interface EducationalContext {
    /** Educational Context key */
    key: string;
    /** Language of the educational context name */
    language: string;
    /** Educational Context name translated */
    name: string;
}

/** Educational Context array from JSON source */
export const educationalContexts: EducationalContext[] = contexts;

/**
 * Finds an educational context given a key and a language key
 *
 * @param key Educational Context key
 * @param language Language key
 *
 * @returns EducationalContext instance or undefined if not found
 */
export function findEducationalContextByKeyAndLanguage(
    key: string,
    language: Language
): EducationalContext | undefined {
    return educationalContexts.find(ec => ec.key === key && (ec.language as Language) === language);
}

/**
 * Find educational contexts by language key
 *
 * @param language Language key
 *
 * @returns Array of educational contexts
 */
export function findEducationalContextsLanguage(language: Language): EducationalContext[] {
    return educationalContexts.filter(ec => (ec.language as Language) === language);
}

/** File that contains common models for managing general concepts*/

/** Supported languages enumerator */
export enum Language {
    ES = 'es',
    EN = 'en',
    FR = 'fr',
    GR = 'el',
    LI = 'lt',
}

/**
 * Returns an array of strings containing all the supported language keys
 */
export function valuesOfLanguages(): string[] {
    return ['es', 'en', 'fr', 'el', 'lt'];
}

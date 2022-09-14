import { Language } from './general';

/** File that contains common models for managing the domain concept: Category*/

/**
 * Item for the CategoryPath cache
 */
export interface CategoryPathsCacheItem {
    /** Cache key */
    key: string;
    /** Category Paths */
    paths: Path[];
}

/**
 * Category Path item
 */
export interface Path {
    /** Array of category keys that conform the Category Path */
    path: string[];
}

/**
 * Category model
 */
export interface Category {
    /** Category key */
    key: string;
    /** Subcategories */
    subCategories?: Category[];
}

/**
 * Translated Category Resource
 */
export interface CategoryResource {
    /** Category key */
    key: string;
    /** Language in which the Category is translated */
    language: Language;
    /** Translation text literal */
    translation: string;
}

/**
 * Category with all translations
 */
export interface CategoryIndex {
    /** Category key */
    key: string;
    /** Category translations */
    resources: CategoryTranslation[];
}

/**
 * Category translation element
 */
export interface CategoryTranslation {
    /** Language key */
    language: string;
    /** Translation text literal */
    translation: string;
}

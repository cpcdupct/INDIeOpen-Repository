import { Injectable } from '@angular/core';
import {
    Category,
    CategoryIndex,
    CategoryPathsCacheItem,
    CategoryResource,
    Language,
    Path,
} from '@core/models';
import { TranslateService } from '@ngx-translate/core';

import categoriesTranslations from '../../data/categories-translations.json';
import categories from '../../data/categories.json';

/**
 * Service that handles the category item within the application. It handles the CategoryPathCache and the cateogry translations.
 */
@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    /** INDIe Categories */
    private INDIeCategories: Category[] = categories;

    /** Translations of categories */
    private INDIeCategoriesTranslations: CategoryIndex[] = categoriesTranslations;

    /** Cache limit  */
    private CACHE_LIMIT = 60;

    /** Category paths cache */
    private cache: CategoryPathsCacheItem[];

    /** Translations cache */
    private categoryTranslationCache: CategoryResource[] = [];

    constructor(private translateService: TranslateService) {
        // Build the caches
        this.cache = [];
        this.categoryTranslationCache = this.findTranslations(
            this.translateService.getBrowserLang() as Language
        ).sort((c1, c2) => (c1.translation > c2.translation ? 1 : -1));
    }

    /**
     * Gets a 'page' of CategoryResource matching the specified term. If term is not specified, it is not taken into account.
     *
     * @param page Page number (from 0)
     * @param size Page size
     * @param term Category term string
     */
    public getPageOfCategories(page: number, size: number, term?: string): CategoryResource[] {
        // If it is not a search, then get a slice from the array
        if (!term) return this.categoryTranslationCache.slice(page * size, page * size + size);

        // If it is a search, apply the filter and then get slice from array
        return this.categoryTranslationCache
            .filter(c => c.translation.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
            .slice(page * size, page * size + size);
    }

    /**
     * Get the category paths given a category key
     *
     * @param key Category key
     */
    public getCategoryPaths(key: string): Path[] {
        // 1 If it is in the cache, then return the cache element
        const cacheItem = this.findInCache(key);
        if (cacheItem !== undefined) return cacheItem.paths;

        // 2 If it's not in cache, then obtain it
        const paths: Path[] = this.getPathsForCategory(key);

        // 3 Add the path to the cache
        this.appendToCache(key, paths);

        // 4 If the cache lenght is over the limit, the first element is removed
        if (this.cache.length > this.CACHE_LIMIT) this.cache.shift();

        // 5 Return the path
        return paths;
    }

    /**
     * Find a Category Translation by the Category key
     *
     * @param key Category key
     * @param language Language key
     */
    public findTranslationForCategory(key: string, language: Language): string {
        // Find category translation
        const translationIndex = this.INDIeCategoriesTranslations.find(c => c.key === key);
        if (!translationIndex) return key;

        // Find translation in desired language
        const translationResource = translationIndex.resources.find(
            ti => (ti.language as Language) === language
        );

        if (translationResource) return translationResource.translation;

        // Find default translation
        const defaultTranslation = translationIndex.resources.find(
            ti => (ti.language as Language) === Language.EN
        );

        if (defaultTranslation) return defaultTranslation.translation;

        // if nothing is found
        return key;
    }

    /**
     * Find category translations given a language
     *
     * @param language Language key
     */
    public findTranslations(language: Language): CategoryResource[] {
        const categoriesResources: CategoryResource[] = [];

        for (const categoryTranslation of this.INDIeCategoriesTranslations) {
            const translation = categoryTranslation.resources.find(
                r => r.language === language
            )?.translation;

            categoriesResources.push({
                key: categoryTranslation.key,
                language,
                translation: translation ? translation : '',
            });
        }

        return categoriesResources;
    }

    /**
     * Search a category by a term in a given language
     *
     * @param term Category term
     * @param language Language key
     */
    public searchCategories(term: string, language: Language): CategoryResource[] {
        const categoriesFound: CategoryResource[] = [];

        for (const translationIndex of this.INDIeCategoriesTranslations) {
            const translation = translationIndex.resources.find(res => res.language === language);
            if (translation) {
                if (translation.translation.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
                    categoriesFound.push({
                        key: translationIndex.key,
                        language,
                        translation: translation.translation,
                    });
            }
        }

        return categoriesFound;
    }

    /**
     * Get the translated category given a category key and a language key
     *
     * @param language Language key
     * @param key Category key
     */
    public getTranslatedCategories(language: Language, key: string): CategoryResource | undefined {
        const translation = this.findTranslationForCategory(key, language);

        return {
            key: key,
            language: language,
            translation,
        };
    }

    /**
     * Find a CategoryPathCacheItem in cache by a cateogry key
     *
     * @param key Category key
     */
    private findInCache(key: string): CategoryPathsCacheItem | undefined {
        return this.cache.find(item => item.key === key);
    }

    /**
     * Pushes a path array to the path cache given a category key
     *
     * @param key Category key
     * @param paths Paths array
     */
    private appendToCache(key: string, paths: Path[]) {
        this.cache.push({
            key,
            paths,
        });
    }

    /**
     * Get the final paths where the category is the last step in the path.
     *
     * @param key Category key
     *
     * @returns Path of the category from the root in an array of keys
     */
    private getPathsForCategory(key: string): Path[] {
        const paths: Path[] = [];
        const currentPath: string[] = [];

        const getSubTree = (category: Category) => {
            // 1 Add this category as visited
            currentPath.push(category.key);

            // 2 Check if this is the category, in that case it is added to the current path
            if (category.key === key) {
                paths.push({
                    path: [...currentPath],
                });
            }

            // 3 Search in children
            if (category.subCategories && category.subCategories.length > 0) {
                for (const subCategory of category.subCategories) {
                    getSubTree(subCategory);
                }
            }

            // 4 Remove the category from the visited
            currentPath.pop();
        };

        for (const category of this.INDIeCategories) {
            getSubTree(category);
        }

        return paths;
    }

    /**
     * Get INDIe categories
     */
    get categories(): Category[] {
        return this.INDIeCategories;
    }

    /**
     * Get INDIe Category translations
     */
    get translations(): CategoryIndex[] {
        return this.INDIeCategoriesTranslations;
    }
}

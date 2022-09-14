import { Language } from './general';
import { AuthorResource } from './user';

/** File that contains common models for managing the domain concept: Unit.*/

/** Unit */
export interface Unit {
    /** Unit id */
    id: number;
    /** Created at date */
    createdAt: Date;
    /** Updated at date */
    updatedAt?: Date;
    /** Unit type */
    type: UnitType;
    /** Unit license */
    license: License;
    /** CC License */
    creativeCommons: CreativeCommons;
    /** Unit mode */
    mode: UnitMode;
    /** Unit author */
    author: AuthorResource;
    /** Unit information */
    information: UnitInformation;
    /** Unit publishing information */
    published: {
        /** Published date if published */
        publishedDate?: Date;
        /** Resource id if published */
        resource?: string;
        /** Learning analytics on/off */
        analytics: boolean;
    };
    /** Rating stats for the unit */
    rating: RatingStats;
    /** Original unit stamp in case of reused unit */
    originalUnit?: OriginalUnitStamp;
}

/** Unit information */
export interface UnitInformation {
    /** Applied unit theme  */
    theme: any;
    /** Educational contexts */
    educationalContext: string[];
    /** Unit Age range (0-100) recomendation */
    ageRange: number[];
    /** Unit category key */
    category: string;
    /** Unit short description */
    shortDescription: string;
    /** Unit long description */
    longDescription?: string;
    /** Unit cover image URL */
    cover: string;
    /** Unit tags */
    tags: string[];
    /** Unit name */
    name: string;
    /** Unit language */
    language: Language;
    /** Unit draft */
    draft: boolean;
}

/** Original unit status in reused/copied units */
export interface OriginalUnitStatus {
    /** Last published date */
    lastPublished: Date;
    /** Original unit exists */
    existing: boolean;
    /** Unit resource */
    resource: string;
}

/**
 * Unit types
 */
export enum UnitType {
    CONENT = 'CONTENT',
    EVALUATION = 'EVALUATION',
}

/**
 * Unit licenses
 */
export enum License {
    PRIVATE = 'PRIVATE',
    ALLOW_READ_ONLY = 'ALLOW_READ_ONLY',
    ALLOW_REUSE = 'ALLOW_REUSE',
}

/**
 * Unit mode of creation
 */
export enum UnitMode {
    ORIGINAL = 'ORIGINAL',
    COPIED = 'COPIED',
    REUSED = 'REUSED',
}

/**
 * Creative commons supported licenses
 */
export enum CreativeCommons {
    PRIVATE = 'PRIVATE',
    BY = 'BY',
    BYSA = 'BYSA',
    BYND = 'BYND',
    BYNC = 'BYNC',
    BYNCSA = 'BYNCSA',
    BYNCND = 'BYNCND',
}

/** Rating statistics */
export interface RatingStats {
    /** Number of ratings for the unit */
    count: number;
    /** Average rating value */
    average: number;
}

/** Original unit stamp in case of reused/copied units */
export interface OriginalUnitStamp {
    /** Original unit id in case it still exists */
    id?: number;
    /** Original author name */
    authorName: string;
    /** Original unit name */
    unitName: string;
    /** Unit Reuse/copy Timestamp  */
    timeStamp: Date;
}

/** Unit resource URL */
export interface URLResource {
    /** Url to the resource */
    url: string;
}

/** Editor token resource */
export interface TokenResource {
    token: string;
}

/// FUNCTIONS

/**
 * Checks wether a unit can be edited. In order to be edited mode must be original or reused.
 *
 * @param u Unit
 */
export function canEditUnit(u: Unit): boolean {
    return u.mode === UnitMode.ORIGINAL || u.mode === UnitMode.REUSED;
}

/**
 * Checks wether a unit has been published.
 *
 * @param u Unit
 */
export function isUnitPublished(u: Unit): boolean {
    return u.published.publishedDate !== null && u.published.publishedDate !== undefined;
}

/**
 * Check wether a unit is outadted. An outdated unit is a unit which has been published
 * and is in a draft state.
 *
 * @param u Unit
 */
export function isUnitOutdated(u: Unit): boolean {
    return isUnitPublished(u) && u.information.draft;
}

/**
 * Return wether a unit can have ratings. Only a unit without a private license can have ratings.
 *
 * @param u Unit instance
 */
export function canHaveRatings(u: Unit): boolean {
    return u.license !== License.PRIVATE;
}

/**
 * Return wether a unit can be shared among indieopen users.
 *
 * @param u Unit
 */
export function canShareUnit(u: Unit): boolean {
    return u.mode !== UnitMode.COPIED;
}

/**
 * Return wether a unit can be published into the content server.
 *
 * @param u Unit
 */
export function canPublishUnit(u: Unit): boolean {
    return u.mode === UnitMode.ORIGINAL || u.mode === UnitMode.REUSED;
}

/**
 * Return wether a unit has an original unit associated.
 *
 * @param u Unit
 */
export function hasOriginalUnit(u: Unit): boolean {
    return u.originalUnit !== null && u.mode !== UnitMode.ORIGINAL;
}

/**
 * Return wether a unit can be rated
 *
 * @param u Unit
 */
export function canRate(u: Unit): boolean {
    return hasOriginalUnit(u) && u.originalUnit?.id !== null;
}

/**
 * Return wether a unit has been open-published
 *
 * @param u Unit
 */
export function isOpenPublished(u: Unit): boolean {
    return u.license !== License.PRIVATE;
}

/**
 * Get a License instance corresponding to the license associated with a creative commons license
 *
 * @param cc Creative Commons license
 *
 * @returns License instance
 */
export function getLicenseFromCreativeCommons(cc: CreativeCommons): License {
    switch (cc) {
        case CreativeCommons.BYND:
        case CreativeCommons.BYNCND:
            return License.ALLOW_READ_ONLY;
        case CreativeCommons.BYNCSA:
        case CreativeCommons.BYNC:
        case CreativeCommons.BYSA:
        case CreativeCommons.BY:
            return License.ALLOW_REUSE;
        case CreativeCommons.PRIVATE:
        default:
            return License.PRIVATE;
    }
}

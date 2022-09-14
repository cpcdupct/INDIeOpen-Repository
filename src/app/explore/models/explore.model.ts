import { AuthorResource, RatingStats, UnitType } from '@core/models';

/**
 * Predefined item
 */
export interface PredefinedItem {
    /** Item text in a concrete language */
    texts: {
        lang: string;
        value: string;
    }[];
    /** Cover image URL */
    cover: string;
    /** Action URL associated with the item */
    action: string;
    /** Texts for the action link */
    actionTexts: {
        lang: string,
        value: string
    }[];
    /** Item optional parameters */
    params: {};
}

/**
 * Recent added unit model
 */
export interface RecentAddedUnit {
    /** Unit id */
    id: number;
    /** Unit name */
    name: string;
    /** Unit image cover URL */
    cover: string;
    /** Unit category key */
    category: string;
    /** Unit rating stats */
    rating: RatingStats;
    /** Unit type */
    type: UnitType;
    /** Unit author */
    author: AuthorResource;
}

/** Top rated unit model */
export interface TopRatedUnit {
    /** Unit id */
    id: number;
    /** Unit name */
    name: string;
    /** Unit image cover URL */
    cover: string;
    /** Unit published at */
    publishedAt: Date;
    /** Unit rating stats */
    rating: RatingStats;
    /** Unit description */
    description: string;
    /** Unit type */
    type: UnitType;
}

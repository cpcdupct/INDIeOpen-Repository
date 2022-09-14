// ALERT
/**
 * Alert class wrapper
 */
export class Alert {
    /** Alert id */
    id!: string;
    /** Alert type */
    type!: AlertType;
    /** Alert message */
    message!: string;
    /** Modal auto-close flag */
    autoClose!: boolean;
    /** Keep the alert after route change flag */
    keepAfterRouteChange!: boolean;
    /** Alert fade flag */
    fade!: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

/** Alert type */
export enum AlertType {
    Success,
    Error,
    Info,
    Warning,
}

/** Screen size availables */
export enum ScreenSize {
    XS,
    SM,
    MD,
    LG,
    XL,
}

// PAGINATION
/** Number of default page */
export const PAGE_DEFAULT_PAGE = 1;
/** Number of default page size */
export const PAGE_DEFAULT_SIZE = 5;

/**
 * Spring Page Request wrapper
 */
export interface Page<T> {
    /** Number of elements in the page */
    length: number;
    /** Item elements */
    items: T[];
    /** Number of elements in total */
    numberOfElements: number;
}

/**
 * Creates a Page from a Spring Web Page response
 *
 * @param pageableResponse Spring page response
 */
export function createPageResponse<T>(pageableResponse: any): Page<T> {
    return {
        items: pageableResponse.content as T[],
        length: pageableResponse.totalElements,
        numberOfElements: pageableResponse.numberOfElements,
    };
}

// TYPE FILTER

/**
 * Filter type
 */
export interface TypeFilter {
    /** Filter key */
    key: string;
    /** Filter label */
    label: string;
    /** Filter selected value */
    selected: string;
    /** Filter items */
    items: any[];
}

/** Filter change event */
export interface FilterEvent {
    /** Key of the filter that triggered the event */
    filterKey: string;
    /** Selected item keys */
    filterItemKeys: string[];
}

// ORDER
/** Order/sort filter */
export interface OrderFilter {
    /** Filter key  */
    key: string;
    /** Filter selected */
    selected: string;
    /** Filter label */
    label: string;
    /** Available sort items */
    items: OrderItem[];
}

/** Order/sort item */
export interface OrderItem {
    /** Sort item key */
    key: string;
    /** Sort item label */
    label: string;
    /** Sort options */
    sort?: {
        /** By name */
        name: string;
        /** Spring order */
        order: string;
    };
}

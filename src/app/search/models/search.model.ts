import { Language, License, RatingStats, UnitMode, UnitType } from '@core/models';

/**
 * Generic filter wrapper
 */
export interface GenericFilter {
    /** Filter key */
    key: string;
    /** Filter label in i18n key */
    label: string;
    /** Selected value of a filter */
    selected: string | undefined;
}

/** Filter wrapper */
export interface Filter {
    /** Filter key */
    key: string;
    /** Filter label in i18n key */
    label: string;
    /** Available filter items */
    items: FilterItem[];
}

/**
 * Filter item
 */
export interface FilterItem {
    /** Item key */
    key: string;
    /** Item label in i18n key */
    label: string;
    /** Item selected */
    isSelected: boolean;
    /** SubItems */
    subItems: FilterItem[];
    /** If subitems are 'collapsed' in the view */
    isClosed?: boolean;
    /** If this item represents the whole filter items selected */
    isAll?: boolean;
}

/** Radio filter wrapper */
export interface RadioFilter {
    /** Filter key */
    key: string;
    /** Filter label in i18n key */
    label: string;
    /** Selected select */
    selected: string;
    /** Available radio items */
    items: RadioFilterItem[];
}

/** Radio filter item */
export interface RadioFilterItem {
    /** Item key */
    key: string;
    /** Item label in i18n key */
    label: string;
}

/** Slider filter wrapper */
export interface SliderFilter {
    /** Filter key */
    key: string;
    /** Filter label in i18n key */
    label: string;
    /** Minimum absolute value */
    floor: number;
    /** Maximum absolute value */
    ceil: number;
    /** Currently selected minimum */
    selectedMinimum: number;
    /** Currently selected maximum */
    selectedMaximum: number;
}

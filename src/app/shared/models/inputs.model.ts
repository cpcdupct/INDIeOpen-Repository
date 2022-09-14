import { FormControl } from '@angular/forms';
import intervalToDuration from 'date-fns/intervalToDuration';

/**
 * Input data
 */
export interface InputData {
    /** Type of autocomplete */
    autocomplete?: string;
    /** Input type */
    type?: string;
    /** i18n key for input limit */
    limit?: string;
    /** Minimum number of characters */
    minLength?: number;
    /** Maximum number of characters */
    maxLength?: number;
    /** Input is required flag */
    required?: boolean;
    /** i18n input label */
    label?: boolean;
    /** Input name */
    name: string;
    /** i18n base component */
    component: string;
    /** Form control associated with the Input */
    control: FormControl;
}

/** Select option wrapper */
export interface OptionWrapper {
    /** Selected value */
    selected: string;
    /** Select options */
    options: OptionItem[];
}

/** Option item */
export interface OptionItem {
    /** Option value */
    value: string;
    /** Option i18n key */
    label: string;
    /** Option group */
    group?: string;
}

/** Defualt select range minimum value */
export const RANGE_MIN_DEFAULT = 3;
/** Default select range maximu value */
export const RANGE_MAX_DEFAULT = 99;

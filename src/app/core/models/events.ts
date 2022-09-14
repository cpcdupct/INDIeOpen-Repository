/** File that contains common models for managing Events*/

/**
 * Event that represents a result of an action
 */
export interface ActionResultEvent {
    /** Type of event */
    type: ActionResultEventType;
    /** Translated message key  */
    messageKey: string;
    /** Event data if any */
    data?: any;
}

/** Event types enumerator */
export enum ActionResultEventType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS,
}

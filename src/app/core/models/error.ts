/** File that contains common models for managing the INDIe Error abstraction*/

/** INDIe Error Abstraction from a web request */
export interface INDIeError {
    /** Error code identifier */
    errorCode: string;
    /** Array of error fields */
    errors: INDIeErrorParam[];
    /** Error description */
    msg: string;
    /** Response status code*/
    status: number;
    /** Request timestamp */
    timestamp: Date;
}

/**
 * Error field interface
 */
export interface INDIeErrorParam {
    /** Field name */
    field: string;
    /** Message error description */
    message: string;
}

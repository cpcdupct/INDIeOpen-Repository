import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

/**
 *  Catches and prints an error
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
    constructor() {}

    /**
     * Prints an error into the console
     *
     * @param error Error instance
     */
    handleError(error: Error | HttpErrorResponse) {
        console.error(error);
        console.error(error.name);
        console.error(error.message);
    }
}

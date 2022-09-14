import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ToastrWrapperService } from '../toastr-wrapper/toastr-wrapper.service';

/**
 * Global handler that handles error within a form inside the application and shows a toast with an error message.
 */
@Injectable({
    providedIn: 'root',
})
export class FormErrorHandlerService implements ErrorHandler {
    constructor(private toastrWrapper: ToastrWrapperService) {}

    /**
     * Method that shows a toast given an error response
     *
     * @param errorResponse Error response
     */
    handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error === undefined || errorResponse.error === null) return;

        switch (errorResponse.error.errorCode) {
            case 'WRONG_PARAMS':
                this.toastrWrapper.error(
                    'messages.wrong_params.message',
                    'messages.wrong_params.title'
                );
                break;

            case 'NO_CONTENT_FOUND':
                this.toastrWrapper.error(
                    'messages.no_content_found.message',
                    'messages.no_content_found.title'
                );
                break;

            case 'ENTITY_NOT_ACCESSIBLE':
                this.toastrWrapper.error(
                    'messages.entity_not_accessible.message',
                    'messages.entity_not_accessible.title'
                );
                break;

            case 'UNIT_NOT_SHAREABLE':
                this.toastrWrapper.error(
                    'messages.unit_not_shareable.message',
                    'messages.unit_not_shareable.title'
                );
                break;

            case 'UNIT_ALREADY_PUBLISHED':
                this.toastrWrapper.error(
                    'messages.unit_already_published.message',
                    'messages.unit_already_published.title'
                );
                break;

            case 'UNAUTHORIZED_REQUEST':
                this.toastrWrapper.error(
                    'messages.unauthorized_request.message',
                    'messages.unauthorized_request.title'
                );
                break;

            default:
                this.toastrWrapper.error(
                    'messages.internal_server_error.message',
                    'messages.internal_server_error.title'
                );

                break;
        }
    }
}

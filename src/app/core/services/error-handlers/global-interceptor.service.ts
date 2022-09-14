import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import HttpStatusCode from '@shared/models/statusCodes.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { ToastrWrapperService } from '../toastr-wrapper/toastr-wrapper.service';

/**
 * Global Exception interceptor that catches an http error and
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalHttpInterceptorService implements HttpInterceptor {
    constructor(
        public router: Router,
        private toastrWrapper: ToastrWrapperService,
        private authService: AuthService
    ) {}

    /**
     * Intercept and treats an HttpRequest error
     *
     * @param req HTTP Request object
     * @param next Next in the request chain
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                let handled = false;
                console.error(error);

                if (error instanceof HttpErrorResponse) {
                    if (error.error instanceof ErrorEvent) {
                        console.error('Error Event');
                    } else {
                        console.log(`error status : ${error.status} ${error.statusText}`);

                        switch (error.status) {
                            case HttpStatusCode.FORBIDDEN:
                            case HttpStatusCode.UNAUTHORIZED:
                                this.router.navigateByUrl('/explore');
                                if (this.showMessage(error))
                                    this.toastrWrapper.error(
                                        'messages.unauthorized_request.message',
                                        'messages.unauthorized_request.title'
                                    );
                                this.authService.clearUser();
                                handled = true;
                                break;
                            case HttpStatusCode.BAD_REQUEST:
                                this.toastrWrapper.error(
                                    'messages.bad_request.message',
                                    'messages.bad_request.title'
                                );
                                break;
                            case HttpStatusCode.NOT_FOUND:
                                break;
                            default:
                                this.toastrWrapper.error(
                                    'messages.internal_server_error.message',
                                    'messages.internal_server_error.title'
                                );
                                break;
                        }
                    }
                } else {
                    console.error('Other Errors');
                }

                if (handled) {
                    return of(error);
                } else {
                    return throwError(error);
                }
            })
        );
    }

    /**
     * Return wether the interceptor must show an error message or if it's a silent error.
     *
     * @param error  HTTP Error Response
     */
    private showMessage(error: HttpErrorResponse): boolean {
        if (error.url !== null) {
            const realUrl = new URL(error.url);
            if (this.isPathInSilentURLS(realUrl.pathname)) return false;
        }

        return true;
    }

    /**
     * Return wether a pathname is part of a silent url.
     *
     * @param pathname Pathname
     */
    private isPathInSilentURLS(pathname: string): boolean {
        const paths = ['/api/security/oauth/token'];

        for (const path of paths) {
            if (pathname.startsWith(path)) return true;
        }

        return false;
    }
}

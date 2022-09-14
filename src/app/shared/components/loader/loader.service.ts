import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

/**
 * Services that handle a loader component that can be used anywhere in the application
 */
@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    /** Loading subject */
    private loadingSubject = new BehaviorSubject<boolean>(false);

    /** Get an observable from the loader */
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor() {}

    /**
     * Show a loader gif untill the observable is completed
     *
     * @param obs$ Loader Observable
     */
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
    }

    /**
     * Show the loader
     */
    loadingOn() {
        this.loadingSubject.next(true);
    }

    /** Hide the loader */
    loadingOff() {
        this.loadingSubject.next(false);
    }
}

import { Injectable } from '@angular/core';
import { ScreenSize } from '@shared/models';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Service that handles resizing events to provide a current ScreenSize.
 */
@Injectable({
    providedIn: 'any',
})
export class ResizeService {
    /** Size changed subject */
    private sizeChangedSubject: Subject<ScreenSize>;

    constructor() {
        this.sizeChangedSubject = new Subject();
    }

    /**
     * Function that sets the current ScreenSize
     *
     * @param size Screen size
     */
    onResize(size: ScreenSize) {
        this.sizeChangedSubject.next(size);
    }

    /**
     * Gets the observable of size changing
     */
    get onSizeChanged$(): Observable<ScreenSize> {
        return this.sizeChangedSubject.asObservable().pipe(distinctUntilChanged());
    }
}

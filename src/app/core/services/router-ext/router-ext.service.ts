import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Service that catches the last url accessed by the user
 */
@Injectable({
    providedIn: 'root',
})
export class RouterExtService {
    /** Previous url subject */
    private previousUrlSubject: BehaviorSubject<string>;

    /** Previous url observable */
    public previousUrl$: Observable<string>;

    /** Previos url value */
    previousUrl = '/';

    /** Current url value */
    currentUrl = '/';

    constructor(private router: Router) {
        this.previousUrlSubject = new BehaviorSubject<string>('/');
        this.previousUrl$ = this.previousUrlSubject.asObservable();
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                const navEvent: NavigationEnd = event as NavigationEnd;
                this.previousUrl = this.currentUrl;
                this.currentUrl = navEvent.url;
                this.previousUrlSubject.next(this.previousUrl);
            });
    }
}

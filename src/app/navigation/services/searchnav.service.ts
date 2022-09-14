import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service that handles the sidebar menu in a mobile view
 */
@Injectable({
    providedIn: 'root',
})
export class SearchNavService {
    private searchQuery$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    /**
     * Get the search query observable
     */
    getSearchQuery(): Observable<string> {
        return this.searchQuery$.asObservable();
    }

    /**
     * Set the search query
     *
     * @param showHide Show or hide the menu
     */
    setSearchQuery(search: string) {
        this.searchQuery$.next(search);
    }

    /**
     * Return the current search term
     */
    getSearchTerm(): string {
        return this.searchQuery$.value;
    }
}

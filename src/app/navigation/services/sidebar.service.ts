import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service that handles the sidebar menu in a mobile view
 */
@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    /** Show menu */
    private showMenu$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private router: Router) {
        this.router.events.subscribe(() => {
            this.setShowMenu(false);
        });
    }

    /**
     * Get the show menu observable
     */
    getShowMenu(): Observable<boolean> {
        return this.showMenu$.asObservable();
    }

    /**
     * Set if the menu has to be shown
     *
     * @param showHide Show or hide the menu
     */
    setShowMenu(showHide: boolean) {
        this.showMenu$.next(showHide);
    }

    /**
     * Toggle the menu
     */
    toggleMenu() {
        this.showMenu$.next(!this.showMenu$.value);
    }

    /**
     * Return wether the menu is opern
     */
    isMenuOpen(): boolean {
        return this.showMenu$.value;
    }
}

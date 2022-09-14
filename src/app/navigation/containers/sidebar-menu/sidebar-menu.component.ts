import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, ChangeThemeService } from '@core/services';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { MenuDirection } from 'app/navigation/models';
import { SidebarService } from 'app/navigation/services';
import { Observable } from 'rxjs';

/**
 * Sidebar component for drawing the mobile menu
 */
@Component({
    selector: 'io-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss'],
    providers: [NgbCollapseConfig],
})
export class SidebarMenuComponent implements OnInit {
    /** Show/hide menu observable */
    showMenu: Observable<boolean>;

    /** Duration of hide/show menu transition */
    @Input()
    duration: number = 0.25;

    /** Menu width */
    @Input()
    navWidth: number = window.innerWidth;

    /** Menu direction from which it will appear */
    @Input()
    direction: MenuDirection = MenuDirection.Left;

    /** If explore menu is collapsed */
    exploreCollapsed = true;
    /** If my content menu is collapsed */
    myContentCollapse = true;

    constructor(
        private sidebarService: SidebarService,
        private themeService: ChangeThemeService,
        private authService: AuthService,
        private router: Router,
        private elem: ElementRef
    ) {
        this.showMenu = this.sidebarService.getShowMenu();
    }

    ngOnInit(): any {
        // Put the focus on the sidebar menu as soon as it is shown
        this.sidebarService.getShowMenu().subscribe(e => {
            let target = e
                ? this.elem.nativeElement.querySelector('.side-nav-bar-menu-container')
                : document.querySelector('.navbar-toggler');
            setTimeout(function () {
                target.focus();
            }, (this.duration * 1000) / 2);
        });
    }

    /**
     * Event capturing the close of the menu. It sets the menu shown to false
     */
    onSidebarClose() {
        this.sidebarService.setShowMenu(false);
    }

    /**
     * Handle key press on sidebar menu
     */
    onKey(e: any) {
        // Close the sidebar if the user presses the escape key
        if (e.keyCode === 27) {
            e.preventDefault();
            this.onSidebarClose();
        }
        // Trap focus inside sidebar (handle tab key)
        else if (e.keyCode === 9) {
            e.preventDefault();
            let focusables = Array.prototype.filter.call(
                this.elem.nativeElement.querySelectorAll('a, button'),
                // Filter visible elements
                node => node.offsetWidth > 0 && node.offsetHeight > 0
            );
            let focusIdx = -1;
            for (let idx = 0; idx < focusables.length; idx++)
                if (document.activeElement === focusables[idx]) focusIdx = idx;
            // Focus the first element if no element is focused
            if (focusIdx === -1) {
                focusables[0].focus();
                return;
            }
            let nextFocus = (e.shiftKey ? focusIdx - 1 : focusIdx + 1) % focusables.length;
            focusables[nextFocus].focus();
        }
    }

    /**
     * Get the menu bar style
     *
     * @param showNav If the nav must be shown
     */
    getMenuBarStyle(showNav: boolean | null) {
        let navBarStyle: any = {};

        navBarStyle.transition =
            this.direction + ' ' + this.duration + 's, visibility ' + this.duration + 's';
        navBarStyle.width = this.navWidth + 'px';
        navBarStyle[this.direction] = (showNav ? 0 : this.navWidth * -1) + 'px';

        return navBarStyle;
    }

    /**
     * Get the application name based on the applied tenant
     */
    get appName(): string | undefined {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.name;
    }

    /**
     * Return wether the user is logged in
     */
    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }
}

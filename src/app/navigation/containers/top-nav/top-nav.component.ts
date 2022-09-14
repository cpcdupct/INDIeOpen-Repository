import { Location } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, NavigationEnd, Router } from '@angular/router';
import { AuthService, ChangeThemeService, ToastrWrapperService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchNavService, SidebarService } from 'app/navigation/services';
import { DOCUMENT } from '@angular/common';

import { LoginViewComponent } from '../../components';
import { Unit } from '@core/models';
import { SearchService } from 'app/search/services';

@Component({
    selector: 'io-top-nav',
    templateUrl: './top-nav.component.html',
    styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
    /** Navbar style */
    navbar = 'transparent';
    /** Book icon url */
    urlBook = '/assets/img/book.png';
    /** If the application is in the Explore page */
    explorePage = true;
    /** Offset breakpoint in height in px */
    offsetBreakHeigth!: number;
    /** Current position in heigth in px */
    currentPositionInHeigth!: number;
    /** Height padding in px */
    heightPadding = 40;

    /** Search text */
    searchText!: string;

    currentUrl: string = '';

    units!: Unit[];

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private location: Location,
        private toastrWrapper: ToastrWrapperService,
        private themeService: ChangeThemeService,
        private sidebarService: SidebarService,
        private searchService: SearchNavService,
        private searchUnitsService: SearchService,
        @Inject(DOCUMENT) private document: Document
    ) {
        router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                if (e.url != '') {
                    // Remove previous anchor and put the new one
                    this.currentUrl = e.url.split('#')[0] + '#main';
                } else {
                    this.currentUrl = '';
                }
            }
        });
    }

    ngOnInit(): void {
        // This is needed to use the transparent style in the nav if the application is in the explore page
        this.router.events.subscribe(value => {
            if (value instanceof NavigationStart) {
                this.explorePage = this.isMainPage(value.url);

                if (this.explorePage) {
                    this.currentPositionInHeigth =
                        window.pageYOffset ||
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0;

                    this.offsetBreakHeigth = window.innerHeight - this.heightPadding;
                    this.setNavStyle();
                } else {
                    this.navbar = 'dark';
                    this.urlBook = '/assets/img/book_blanco.png';
                }
            }
        });

        // Show an authorized state message
        this.route.queryParamMap.subscribe(params => {
            if (params.has('forbidden') && params.get('forbidden') === 'true') {
                this.location.replaceState('/explore');
                this.toastrWrapper.error('messages.login', 'Ooops');
            }
        });
        // Load the current query from the search service
        this.searchService.getSearchQuery().subscribe(query => (this.searchText = query));
    }

    skipNav(event: any) {
        // Change URL
        event.preventDefault();
        this.location.replaceState(this.currentUrl);
        this.document.getElementById('main')?.focus();
    }

    /**
     * Search term changed event
     *
     * @param event Event instance
     */
    dataChanged(event: Event) {
        if (this.searchText.length >= 3) {
            this.searchUnitsService
                .searchUnits(1, { text: this.searchText, size: 5 })
                .subscribe(res => {
                    this.units = res.items;
                });
        }
    }

    /**
     * Return wether the url is in the explore module
     *
     * @param url Current url
     */
    private isMainPage(url: string): boolean {
        return url.startsWith('/explore') || url === '/';
    }

    /**
     * Screen scroll event listener
     *
     * @param $event Event instance
     */
    @HostListener('window:scroll', ['$event'])
    WindowsScroll($event: Event) {
        if (this.explorePage) {
            this.currentPositionInHeigth =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;

            this.offsetBreakHeigth = window.innerHeight - this.heightPadding;
            this.setNavStyle();
        }
    }

    /** Sets the nav style based on the current position of the screen */
    setNavStyle() {
        const currentNavbar = this.navbar;

        if (this.currentPositionInHeigth >= this.offsetBreakHeigth) {
            this.navbar = 'dark';
        } else if (this.currentPositionInHeigth < this.offsetBreakHeigth) {
            this.navbar = 'transparent';
        }

        if (this.navbar !== currentNavbar) {
            if (this.navbar === 'dark') {
                this.urlBook = '/assets/img/book_blanco.png';
            } else if (this.navbar === 'transparent') {
                this.urlBook = '/assets/img/book.png';
            }
        }
    }

    /** Get the applied nav styles based on the transparent or dark style */
    navStyles() {
        return {
            'navbar-light': this.navbar === 'transparent',
            'bg-transparent': this.navbar === 'transparent',
            'navbar-small': this.navbar === 'transparent',
            'navbar-dark': this.navbar === 'dark',
            darkBlue_bg: this.navbar === 'dark',
            'navbar-large': this.navbar === 'dark',
        };
    }

    /**
     * Show the login window
     */
    showLogin() {
        this.modalService
            .open(LoginViewComponent, LoginViewComponent.options)
            .result.then(result => {
                if (result.logged) {
                    this.toastrWrapper.success(
                        'io-login-view.messages.login_now',
                        'io-login-view.messages.login_welcome'
                    );
                } else if (result.reset) {
                    this.toastrWrapper.success(
                        'io-login-view.messages.email_sent',
                        'common.success'
                    );
                }
            })
            .catch(reason => {});
    }

    /**
     * Return wether the user is logged in
     */
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    /** User status change event listener. User logout is handled */
    onUserStatusChanged(result: boolean) {
        this.toastrWrapper.success(
            'io-login-view.messages.logout',
            'io-login-view.messages.goodbye'
        );

        this.router.navigateByUrl('/explore', { skipLocationChange: false }).then(() => {
            this.router.navigate(['/explore']);
        });
    }

    /**
     * Key pressed event listener
     *
     * @param event Key pressed event
     */
    keyPress(event: any) {
        if (event.key !== 'Enter') return;

        if (this.searchText === undefined) {
            this.toastrWrapper.info('search.warning', 'common.warning');
            return;
        }

        if (this.searchText.length >= 3) {
            this.searchService.setSearchQuery(this.searchText);
            this.router
                .navigate(['search'], { queryParams: { text: this.searchText } })
                .then(valid => {
                    // Triggers a focus in h1 title element to tell the user that the content has changed
                    valid && setTimeout(() => this.document.getElementById('title')?.focus(), 1);
                });
        } else this.toastrWrapper.info('search.warning', 'common.warning');
    }

    /**
     * Navigation through menu bar -> triggers a focus in h1 title element to tell the user that the content has changed
     * @param event
     */
    navigate(event: any) {
        let href = event.target.getAttribute('href');
        this.router.navigateByUrl(href).then(valid => {
            valid && setTimeout(() => this.document.getElementById('title')?.focus(), 1);
        });
    }

    /**
     * Get the application name based on the current tenant
     */
    get appName() {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.name;
    }

    /**
     * Toggle sidebar menu
     */
    toggleMenu() {
        this.sidebarService.setShowMenu(true);
    }
}

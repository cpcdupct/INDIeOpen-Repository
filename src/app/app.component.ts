import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Theme } from '@core/models';
import { ChangeThemeService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs/operators';

/**
 * Main app component. It sets up the translation system and sets some theme-dependant information.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'INDIeOpen';
    @ViewChild(ToastContainerDirective, { static: true }) toastContainer:
        | ToastContainerDirective
        | undefined;

    constructor(
        private translate: TranslateService,
        private themeService: ChangeThemeService,
        private titleService: Title,
        private toastrService: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Setting theme
        const theme = this.themeService.getThemeOrDefault();
        this.titleService.setTitle(theme.name);

        // Settings language and translations
        this.translate.setDefaultLang('en');
        this.translate.use(this.translate.getBrowserLang()).subscribe(res => {
            // COOKIES when language is available
            this.showCookies(theme);
        });
        this.document.documentElement.lang = this.translate.getBrowserLang();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => {
                    let child = this.activatedRoute.firstChild;
                    while (child) {
                        if (child.firstChild) {
                            child = child.firstChild;
                        } else if (child.snapshot.data && child.snapshot.data['title']) {
                            return child.snapshot.data['title'];
                        } else {
                            return null;
                        }
                    }
                    return null;
                })
            )
            .subscribe((data: any) => {
                this.titleService.setTitle(
                    data ? this.translate.instant(data) + ' | ' + theme.name : theme.name
                );
            });
    }

    ngOnInit() {
        this.toastrService.overlayContainer = this.toastContainer;
    }

    showCookies(theme: Theme) {
        let cc = window as any;
        cc.cookieconsent.initialise({
            elements: {
                dismiss: `<button class="cc-btn cc-dismiss">{{dismiss}}</a>`,
                messagelink:
                    '<span id="cookieconsent:desc" class="cc-message">{{message}} <a class="cc-link" href="{{href}}" rel="noopener noreferrer nofollow" target="{{target}}">{{link}}</a></span>',
            },
            palette: {
                popup: {
                    background: theme.colors.indie_blue + 'db',
                },
                button: {
                    background: theme.colors.indie_pink,
                    text: 'white',
                },
            },
            theme: 'classic',
            content: {
                message: this.translate.instant('cookies.message'),
                dismiss: this.translate.instant('cookies.accept'),
                link: this.translate.instant('cookies.link_text'),
                href: '/legal/notice',
                target: '_self',
            },
            cookie: {
                name: 'INDIE_CONSENT',
                domain: environment.cookie_domain,
            },
            window: `<div role="dialog" aria-live="polite" 
                aria-label="${this.translate.instant('cookies.usage')}" 
                aria-describedby="cookieconsent:desc" class="cc-window {{classes}}"><!--googleoff: all-->{{children}}<!--googleon: all--></div>`,
        });
    }
}

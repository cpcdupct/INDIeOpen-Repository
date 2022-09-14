import { Component, OnInit } from '@angular/core';
import { ChangeThemeService } from '@core/services';

/**
 * Footer component
 */
@Component({
    selector: 'io-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    constructor(private themeService: ChangeThemeService) {}

    ngOnInit(): void {}

    /**
     * Twitter link based on the applied thenant
     */
    get twitterLink() {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.social.twitter.url;
    }

    /**
     * Web link based on the applied thenant
     */
    get webLink() {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.social.web.url;
    }
}

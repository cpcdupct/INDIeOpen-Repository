import { Component, OnInit } from '@angular/core';
import { ChangeThemeService } from '@core/services';

/**
 * Welcome component in the explore page. The component shows the platform logo description and the commercial text.
 */
@Component({
    selector: 'io-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    platform: String = 'INDIeOpen';

    constructor(private themeService: ChangeThemeService) {
        this.platform = themeService.getThemeOrDefault().name;
    }

    ngOnInit(): void {}

    /**
     * Get the main image src based on the applied tenant
     */
    mainImageSrc() {
        const appliedTheme = this.themeService.getThemeOrDefault();
        if (appliedTheme) return appliedTheme.resources.mainImage;
    }

    /**
     * Get the main logo src based on the applied tenant
     */
    mainLogoSrc() {
        const appliedTheme = this.themeService.getThemeOrDefault();
        if (appliedTheme) return appliedTheme.resources.mainLogo;
    }
}

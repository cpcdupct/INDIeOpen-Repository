import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Theme } from '@core/models';
import { OriginService } from '../origin/origin.service';
import allThemes from './themes.json';

/**
 * Service that applies the theming based on the domain from where the app is accessed.
 *
 * Theme information is accessed from the themes.json file.
 */
@Injectable({
    providedIn: 'root',
})
export class ChangeThemeService {
    /** All available themes from themes.json file */
    private themes: Theme[] = allThemes;

    constructor(
        private originService: OriginService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    /**
     * Main method that changes the theme based on the domain.
     */
    changeTheme(): Promise<void> {
        return new Promise((resolve, reject) => {
            // Get the theme
            const theme = this.getThemeOrDefault();

            // Delete not needed styles
            const stylesApplied = this.document.querySelectorAll('link[href*="theme-"]');
            stylesApplied.forEach(styleElement => {
                if (!styleElement.getAttribute('href')?.includes(theme.cssFileName)) {
                    styleElement.remove();
                }
            });

            this.document.documentElement.style.setProperty(
                '--indie-blue',
                theme.colors.indie_blue
            );
            this.document.documentElement.style.setProperty(
                '--indie-pink',
                theme.colors.indie_pink
            );

            // Change favicon
            const favIcon: HTMLLinkElement | null = this.document.querySelector('#appIcon');
            if (favIcon) favIcon.href = theme.faviconUrl;

            resolve();
        });
    }

    /**
     * Get the applied theme or the default
     */
    getThemeOrDefault(): Theme {
        const appliedTheme = this.themes.find(t =>
            t.alllowedOrigins.includes(this.originService.getCurrentHostName())
        );
        if (appliedTheme) return appliedTheme;

        const defaultTheme = this.themes.find(t => t.name === 'INDIeOpen');

        if (defaultTheme) return defaultTheme;
        else throw Error('Non aplicable theme');
    }
}

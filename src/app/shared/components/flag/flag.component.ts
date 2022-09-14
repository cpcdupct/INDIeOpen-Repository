import { Component, Input, OnInit } from '@angular/core';
import { Language } from '@core/models';

/**
 * Flag icon component
 */
@Component({
    selector: 'io-flag',
    templateUrl: './flag.component.html',
    styleUrls: ['./flag.component.scss'],
})
export class FlagComponent implements OnInit {
    /**  */
    @Input()
    language!: Language;

    constructor() {}

    ngOnInit(): void {}

    /**
     * Get the icon class from the unit language
     */
    getIconClass(): string {
        return 'flag-icon flag-icon-' + this.getLanguageCode();
    }

    /**
     * Get the language code for the flag icon given a language
     */
    getLanguageCode() {
        switch (this.language) {
            case Language.ES:
                return 'es';
            case Language.FR:
                return 'fr';
            case Language.LI:
                return 'li';
            case Language.GR:
                return 'gr';
            case Language.EN:
            default:
                return 'gb';
        }
    }
}

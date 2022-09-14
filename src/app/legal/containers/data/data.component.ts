import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LegalText, policies } from 'app/legal/LegalText';

@Component({
    selector: 'io-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
    constructor(
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {}

    /**
     * Get the internationalized privacy policy text
     */
    loadPrivacyPolicy() {
        const currentLang = this.translateService.getBrowserLang();
        const legalText = this.loadLegalTextByLanguage(currentLang, policies);
        return legalText ? legalText.text : '';
    }

    /**
     * Load a LegalText by language
     *
     * @param language Language key
     * @param legalTexts  Array of all legal texts
     */
    private loadLegalTextByLanguage(
        language: string,
        legalTexts: LegalText[]
    ): LegalText | undefined {
        const legalText = legalTexts.find(lt => lt.language === language);
        if (legalText) return legalText;

        return legalTexts.find(lt => lt.language === 'en');
    }
}

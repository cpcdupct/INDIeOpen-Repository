import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { cookies, LegalText, notices } from '../../LegalText';

/**
 * Notice component
 */
@Component({
    selector: 'io-notice',
    templateUrl: './notice.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent implements OnInit {
    /** Tab active */
    active = 'notice';

    constructor(private translateService: TranslateService) {}

    ngOnInit(): void {}

    /**
     * Get the internationalized legal notice text
     */
    loadLegalNotice(): string {
        const currentLang = this.translateService.getBrowserLang();
        const legalText = this.loadLegalTextByLanguage(currentLang, notices);
        return legalText ? legalText.text : '';
    }

    /**
     * Get the internationalized cookies text
     */
    loadCookies(): string {
        const currentLang = this.translateService.getBrowserLang();
        const legalText = this.loadLegalTextByLanguage(currentLang, cookies);
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

import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PredefinedItem } from '../../models';

/**
 * Predefined item component
 */
@Component({
    selector: 'io-predefined-item',
    templateUrl: './predefined-item.component.html',
    styleUrls: ['./predefined-item.component.scss'],
})
export class PredefinedItemComponent implements OnInit {
    @Input() index: Number = 0;
    @Input()
    item!: PredefinedItem;

    constructor(private translateService: TranslateService) {}

    ngOnInit(): void {}

    /**
     * Get the localized text for the predefined item
     */
    getText() {
        const currentLangName = this.item.texts.find(
            it => it.lang === this.translateService.getBrowserLang()
        );
        if (currentLangName) return currentLangName.value;
        else return this.item.texts.find(it => it.lang === 'en')?.value;
    }

    /**
     * Get the localized text for the predefined action
     */
    getActionText() {
        const currentLangName = this.item.actionTexts.find(
            it => it.lang === this.translateService.getBrowserLang()
        );
        if (currentLangName) return currentLangName.value;
        else return this.item.texts.find(it => it.lang === 'en')?.value;
    }
}

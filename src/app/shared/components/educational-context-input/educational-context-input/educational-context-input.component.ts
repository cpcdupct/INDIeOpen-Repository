import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EducationalContext, findEducationalContextsLanguage, Language } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { FormInputComponent } from '@shared/components/form-input/form-input.component';

/**
 * Input model
 */
interface EducationalContextInput {
    value: string;
    display: string;
}

/**
 * Educational context input
 */
@Component({
    selector: 'io-educational-context-input',
    templateUrl: './educational-context-input.component.html',
    styleUrls: ['./educational-context-input.component.scss'],
})
export class EducationalContextInputComponent
    extends FormInputComponent
    implements OnInit, AfterViewInit
{
    /** Input items from the educational contexts */
    items!: EducationalContextInput[];
    filteredItems!: EducationalContextInput[];
    context!: string;
    tags!: EducationalContextInput[];

    constructor(private translateService: TranslateService, private elementRef: ElementRef) {
        super();
    }

    /**
     * @inheritdoc
     *
     * Obtain the input values from the educational contexts
     */
    ngOnInit(): void {
        this.items = findEducationalContextsLanguage(
            this.translateService.getBrowserLang() as Language
        ).map((context: EducationalContext) => {
            return {
                display: context.name,
                value: context.key,
            };
        });
        this.filteredItems = this.items;
        this.tags = <EducationalContextInput[]>this.data.control.value || [];
    }

    ngAfterViewInit(): void {}

    onItemRemoved(event: any) {
        let live = this.elementRef.nativeElement.querySelector('#' + this.data.name + '-live');
        live.innerHTML = this.translateService.instant('tags.deleted', {
            name: event.display,
        });
        setTimeout(() => (live.innerHTML = ''), 150);
    }

    addContext(event: MatAutocompleteSelectedEvent) {
        if (!this.tags.map((tag: any) => tag.value).includes(event.option.id)) {
            this.tags.push({ value: event.option.id, display: event.option.value });
            let live = this.elementRef.nativeElement.querySelector('#' + this.data.name + '-live');
            live.innerHTML = this.translateService.instant('tags.added', {
                name: event.option.value,
            });
            setTimeout(() => (live.innerHTML = ''), 150);
            this.data.control.setValue(this.tags);
        }
        this.context = '';
    }

    removeContext(item: EducationalContextInput) {
        let pos = this.tags
            .map((tag: any) => tag.value)
            .findIndex((val: any) => val === item.value);
        if (pos >= -1) {
            let tag = this.tags[pos];
            let live = this.elementRef.nativeElement.querySelector('#' + this.data.name + '-live');
            live.innerHTML = this.translateService.instant('tags.deleted', {
                name: tag.display,
            });
            setTimeout(() => (live.innerHTML = ''), 150);
            this.tags.splice(pos, 1);
            this.data.control.setValue(this.tags);
        }
    }

    filterContext(term: string) {
        this.filteredItems = this.items.filter((item: EducationalContextInput) =>
            item.display.toLowerCase().includes(term)
        );
    }
}

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormInputComponent } from '../form-input/form-input.component';

/**
 * Input select used with tags
 */
@Component({
    selector: 'io-input-tags',
    templateUrl: './input-tags.component.html',
    styleUrls: ['./input-tags.component.scss'],
})
export class InputTagsComponent extends FormInputComponent implements OnInit, AfterViewInit {
    constructor(private elementRef: ElementRef, private translateService: TranslateService) {
        super();
    }

    @ViewChild('input') input: any;

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.fixTagsFocus();
    }

    onTagKeydown(event: any, item: any, index: number) {
        // User presses enter or space on a tag --> Delete it
        if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            this.input.removeItem(item, index);
        }
    }

    fixTagsFocus() {
        // Wait until the new tag is rendered
        setTimeout(() => {
            let tags = this.elementRef.nativeElement.querySelectorAll('tag');
            [].forEach.call(tags, (tag: any) => {
                tag.setAttribute('tabindex', '-1');
                tag.removeAttribute('aria-label');
            });
        }, 1);
    }

    onItemAdded(event: any) {
        let live = this.elementRef.nativeElement.querySelector('#' + this.data.name + '-live');
        live.innerHTML = this.translateService.instant('tags.added', {
            name: event.display,
        });
        this.fixTagsFocus();
        setTimeout(() => (live.innerHTML = ''), 150);
    }

    onItemRemoved(event: any) {
        let live = this.elementRef.nativeElement.querySelector('#' + this.data.name + '-live');
        live.innerHTML = this.translateService.instant('tags.deleted', {
            name: event.display,
        });
        setTimeout(() => (live.innerHTML = ''), 150);
    }

    onItemSelected(event: any) {}
}

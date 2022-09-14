import { Component, Input, OnInit } from '@angular/core';
import { License, RatingStats, Unit, UnitMode, UnitType } from '@core/models';
import { AuthService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewUnitComponent } from '@shared/modals';
import { SearchService } from 'app/search/services';

/**
 * Search component item
 */
@Component({
    selector: 'io-search-item',
    templateUrl: './search-item.component.html',
    styleUrls: ['./search-item.component.scss'],
})
export class SearchItemComponent implements OnInit {
    /** Unit item */
    @Input()
    item!: Unit;

    constructor(
        private modalService: NgbModal,
        private searchService: SearchService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {}

    /**
     * Get the badge css class based on the unit type
     */
    itemTypeClass(): string {
        if (this.item.type === UnitType.CONENT) return 'badge-primary';
        else return 'badge-secondary';
    }

    /**
     * Get the type i18n key based on the unit type
     */
    type(): string {
        if (this.item.type === UnitType.CONENT) return 'types.content';
        else return 'types.evaluation';
    }

    /**
     * Get the unit info an show the view unit modal
     */
    viewUnit() {
        this.searchService.getUnitInfo(this.item.id).subscribe(
            (unit: Unit) => {
                const modalRef = this.modalService.open(
                    ViewUnitComponent,
                    ViewUnitComponent.modalOptions
                );

                modalRef.shown.subscribe(res => {
                    document.querySelector('app-root')?.setAttribute('aria-hidden', 'false');
                });

                modalRef.componentInstance.unit = unit;

                modalRef.componentInstance.rateChanged.subscribe((stats: RatingStats) => {
                    this.item.rating = stats;
                });
            },
            err => {}
        );
    }

    /**
     * Return wether the unit is in the current user's units
     */
    isYourUnit() {
        if (this.authService.isLoggedIn())
            return this.authService.getCurrentUser().id === this.item.author.id;
        return false;
    }

    /**
     * Get the css badge based on unit license
     */
    getBadgeLicenseClass(): string {
        return this.item.license === License.ALLOW_READ_ONLY
            ? 'badge badge-read-only'
            : 'badge badge-reuse';
    }

    /**
     * Return wether this unit is an original unit
     */
    isOriginalUnit() {
        return this.item.mode === UnitMode.ORIGINAL;
    }
}

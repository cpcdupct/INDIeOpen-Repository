import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { INDIeError, RatingStats, Unit, UnitType } from '@core/models';
import { AuthService, ToastrWrapperService, UnitsService } from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ViewUnitComponent } from '@shared/modals';
import { RecentAddedUnit } from 'app/explore/models';
import { ExploreService } from 'app/explore/services';

/**
 * Recent added unit component
 */
@Component({
    selector: 'io-recent-added',
    templateUrl: './recent-added.component.html',
    styleUrls: ['./recent-added.component.scss'],
})
export class RecentAddedComponent implements OnInit {
    @Input()
    unit!: RecentAddedUnit;
    /** Unit loader */
    addUnitLoader = false;

    constructor(
        private modalService: NgbModal,
        private toastrWrapper: ToastrWrapperService,
        private exploreService: ExploreService,
        private authService: AuthService,
        private unitsService: UnitsService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {}

    /**
     * Get the component card background based on the unit type
     */
    backGround() {
        if (this.unit.type === UnitType.CONENT) {
            return {
                background:
                    'linear-gradient(0deg, rgba(7, 6, 54, 0.77), rgba(0, 4, 253, 0.43)), url(' +
                    this.unit.cover +
                    ')',
            };
        } else {
            return {
                background:
                    'linear-gradient(0deg, rgba(147, 31, 74, 0.6), rgba(129, 0, 100, 0.53)), url(' +
                    this.unit.cover +
                    ')',
            };
        }
    }

    /**
     * Get the unit category link
     */
    categoryLink(): string {
        return '/search?category=' + this.unit.category;
    }

    /**
     * Get the unit information and show the view unit modal
     */
    viewUnit() {
        this.exploreService.getUnitInfo(this.unit.id).subscribe(
            (unit: Unit) => {
                const modalRef = this.modalService.open(
                    ViewUnitComponent,
                    ViewUnitComponent.modalOptions
                );

                modalRef.componentInstance.unit = unit;

                modalRef.componentInstance.rateChanged.subscribe((stats: RatingStats) => {
                    this.unit.rating = stats;
                });
            },
            err => {
                this.toastrWrapper.error(
                    'explore.recent-added-units.messages.unit_not_found',
                    'common.error'
                );
            }
        );
    }

    /**
     * Return wether the user is logged in
     */
    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    /**
     * Add a shared unit to the user's units in case the user is logged in
     */
    addUnit() {
        this.addUnitLoader = true;

        this.unitsService
            .addSharedUnit(this.unit.id, this.translateService.getBrowserLang())
            .subscribe(
                (unit: Unit) => {
                    this.toastrWrapper.success('units.messages.unit_added', 'common.success');
                    this.addUnitLoader = false;
                },
                (err: HttpErrorResponse) => {
                    this.addUnitLoader = false;
                    const error: INDIeError = err.error as INDIeError;

                    if (error.errorCode === ShareError.UNIT_ALREADY_ADDED) {
                        this.toastrWrapper.error(
                            'units.messages.unit_already_added',
                            'common.error'
                        );
                    }
                }
            );
    }

    /**
     * Return wether a unit can be added into the user's units
     */
    canAddUnit(): boolean {
        if (this.authService.isLoggedIn())
            return this.authService.getCurrentUser().id !== this.unit.author.id;
        else return false;
    }
}

/** Shared error codes */
enum ShareError {
    UNIT_ALREADY_ADDED = 'UNIT_ALREADY_ADDED',
}

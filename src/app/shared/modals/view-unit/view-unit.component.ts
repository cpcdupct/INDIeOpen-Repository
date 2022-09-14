import { HttpErrorResponse } from '@angular/common/http';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    AfterViewInit,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {
    EducationalContext,
    findEducationalContextByKeyAndLanguage,
    INDIeError,
    Language,
    License,
    Rating,
    RatingStats,
    Unit,
    UnitMode,
    UnitType,
} from '@core/models';
import { AuthService, RatingService, ToastrWrapperService, UnitsService } from '@core/services';
import { URLResourceService } from '@core/services/resources/resources.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/**
 * View unit component
 */
@Component({
    selector: 'io-view-unit',
    styleUrls: ['./view-unit.component.scss'],
    templateUrl: './view-unit.component.html',
})
export class ViewUnitComponent implements OnInit, AfterViewInit {
    constructor(
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private unitsService: UnitsService,
        private resourceService: URLResourceService,
        private toastrWrapper: ToastrWrapperService,
        private translateService: TranslateService,
        private ratingService: RatingService
    ) {}

    /** Modal options */
    static modalOptions: NgbModalOptions = {
        windowClass: 'modal-holder view-unit',
        keyboard: true,
        size: 'lg',
    };
    /** Unit loader */
    addUnitLoader = false;
    /** Unit information */
    @Input()
    unit!: Unit;
    /** Rate change output event */
    @Output()
    rateChanged = new EventEmitter<RatingStats>();
    /** Unit rating */
    rating!: Rating;
    /** Already rated unit */
    alreadyRated = false;
    /** Current user's rate */
    userRate = 0;
    textUserRate = '';

    @ViewChild('rate', { read: ElementRef }) rate: ElementRef | undefined;
    stars: HTMLCollection | undefined;

    /**
     * Return wether the unit can be added into the current user's units
     */
    canAddUnit() {
        if (this.authService.isLoggedIn())
            return this.authService.getCurrentUser().id !== this.unit.author.id;
        else return false;
    }

    /**
     * Return wether the current user is logged in
     */
    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    /**
     * @inheritdoc
     *
     * Obtain the unit rating in case it can be rated
     */
    ngOnInit(): void {
        this.textUserRate = this.translateService.instant('rating.current', {
            current: this.userRate,
            max: 5,
        });
        if (this.canRateUnit()) {
            this.ratingService.findRating(this.unit.id).subscribe(
                (rating: Rating) => {
                    this.alreadyRated = true;
                    this.userRate = rating.rating;
                },
                err => {
                    const error = err.error as INDIeError;

                    if (error.errorCode === 'ENTITY_NOT_ACCESSIBLE') {
                        this.alreadyRated = false;
                    }
                }
            );
        }
    }

    // Make component buttons not focusable
    ngAfterViewInit() {
        this.stars = this.rate?.nativeElement.getElementsByTagName('button');
        [].forEach.call(
            this.rate?.nativeElement.getElementsByTagName('button'),
            (val: HTMLElement, idx: number) => val.setAttribute('tabindex', '-1')
        );
    }

    /**
     * Add a unit into the current user's units
     */
    addUnit() {
        this.addUnitLoader = true;

        this.unitsService
            .addSharedUnit(this.unit.id, this.translateService.getBrowserLang())
            .subscribe(
                (unit: Unit) => {
                    this.toastrWrapper.success('units.messages.unit_added', 'common.success');
                    this.addUnitLoader = false;
                    this.activeModal.close(true);
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
     * Rate changed event listener
     *
     * @param event Event instance
     */
    onRateChange(event: any) {
        this.textUserRate = this.translateService.instant('rating.current', {
            current: this.userRate,
            max: 5,
        });
        this.ratingService.rateUnit(this.unit.id, this.userRate).subscribe((rating: Rating) => {
            this.rating = rating;
            this.toastrWrapper.success(
                'units.tab-original-unit.rated_successfully',
                'common.success'
            );
            this.ratingService.findAverageRating(this.unit.id).subscribe((stats: RatingStats) => {
                this.rateChanged.emit(stats);
                this.unit.rating = stats;
            });
        });
    }

    /**
     * Get the preview unit URL
     */
    previewUnit() {
        if (this.unit.published.resource)
            return this.resourceService.buildOpenPublishedURL(this.unit.published.resource);
        return '';
    }

    /**
     * Get the badge css class based on the unit type
     */
    itemTypeClass(): string {
        if (this.unit.type === UnitType.CONENT) return 'badge-primary';
        else return 'badge-secondary';
    }

    /**
     * Get
     */
    type(): string {
        if (this.unit.type === UnitType.CONENT) return 'types.content';
        else return 'types.evaluation';
    }

    /**
     * Return wether the unit is current user's unit
     */
    isYourUnit() {
        if (this.authService.isLoggedIn())
            return this.authService.getCurrentUser().id === this.unit.author.id;
        return false;
    }

    /**
     * Return wether a unit can be rated
     */
    canRateUnit() {
        return !this.isYourUnit() && this.isLoggedIn();
    }

    /**
     * Return wether the unit is original
     */
    isOriginalUnit() {
        return this.unit.mode === UnitMode.ORIGINAL;
    }

    /**
     * Return a badge css class
     */
    getBadgeLicenseClass(): string {
        return this.unit.license === License.ALLOW_READ_ONLY
            ? 'badge text-wrap badge-read-only'
            : 'badge text-wrap badge-reuse';
    }

    /**
     * Return educational context translated in browser language
     */
    educationalContextTranslations(): EducationalContext[] {
        const contexts: EducationalContext[] = [];

        this.unit.information.educationalContext.forEach(contextKey => {
            const context = findEducationalContextByKeyAndLanguage(
                contextKey,
                this.translateService.getBrowserLang() as Language
            );

            if (context) {
                contexts.push(context);
            }
        });

        return contexts;
    }

    // Customize keyboard interaction with rating component
    onRatingKeyDown(event: any) {
        let key = event.keyCode;
        let prevUserRate = this.userRate;
        if (key === 37 && this.userRate > 0) {
            // Left
            this.userRate -= 1;
        } else if (key === 39) {
            // Right
            if (this.stars?.length && this.userRate < this.stars.length) {
                this.userRate += 1;
            }
        } else if (key === 13 || key === 32) {
            // Enter or space
            event.preventDefault();
            this.onRateChange(event);
        }

        if (prevUserRate !== this.userRate) {
            if (this.stars) {
                if (this.userRate > 0) {
                    let btn = <HTMLScriptElement>Array.from(this.stars)[this.userRate - 1];
                    btn.focus();
                } else this.rate?.nativeElement.focus();
            }
            this.textUserRate = this.translateService.instant('rating.current', {
                current: this.userRate,
                max: 5,
            });
        }
    }
}

enum ShareError {
    UNIT_ALREADY_ADDED = 'UNIT_ALREADY_ADDED',
}

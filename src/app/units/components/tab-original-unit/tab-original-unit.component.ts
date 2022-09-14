import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    ActionResultEvent,
    ActionResultEventType,
    canRate,
    OriginalUnitStatus,
    Unit,
} from '@core/models';
import { Rating } from '@core/models/rating';
import {
    RatingService,
    ToastrWrapperService,
    UnitsService,
    URLResourceService,
} from '@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmActionComponent } from '@shared/modals';
import { ModalData } from '@shared/models';
import moment from 'moment';
import { Observable } from 'rxjs';

@Component({
    selector: 'io-tab-original-unit',
    templateUrl: './tab-original-unit.component.html',
    styleUrls: ['./tab-original-unit.component.scss'],
})
export class TabOriginalUnitComponent implements OnInit, AfterViewInit {
    @Input()
    unit!: Unit;

    /** Rating  */
    rating!: Rating;

    /** Original rating */
    originalRating!: any;

    /** Rate value */
    userRate = 0;

    /** */
    originalUnitStatus$!: Observable<OriginalUnitStatus>;

    /**  */
    updating = false;

    /** Current user's rate */
    textUserRate = '';

    @ViewChild('rate', { read: ElementRef }) rate!: ElementRef;
    stars: HTMLCollection | undefined;

    @Output()
    actionResult = new EventEmitter<ActionResultEvent>();

    constructor(
        private ratingService: RatingService,
        private unitService: UnitsService,
        private toastrService: ToastrWrapperService,
        private resourceService: URLResourceService,
        private modalService: NgbModal,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.findRatingForOriginalUnit();
        this.findRating();
        this.loadOriginalUnitVersionStatus();
        this.textUserRate = this.translateService.instant('rating.current', {
            current: this.userRate,
            max: 5,
        });
    }

    ngAfterViewInit(): void {
        this.stars = this.rate?.nativeElement.getElementsByTagName('button');
        [].forEach.call(
            this.rate?.nativeElement.getElementsByTagName('button'),
            (val: HTMLElement, idx: number) => val.setAttribute('tabindex', '-1')
        );
    }

    /**
     * Load the original version status in case the user wants to update his/her version
     */
    private loadOriginalUnitVersionStatus() {
        this.originalUnitStatus$ = this.unitService.findOriginalUnitStatusVersion(this.unit.id);
    }

    private findRatingForOriginalUnit() {
        if (this.unit.originalUnit?.id)
            this.ratingService.findAverageRating(this.unit.originalUnit.id).subscribe(rating => {
                this.originalRating = rating;
            });
    }

    canRate() {
        return canRate(this.unit);
    }

    findRating() {
        if (this.unit.originalUnit?.id)
            this.ratingService.findRating(this.unit.originalUnit.id).subscribe((rating: Rating) => {
                this.rating = rating;
                this.userRate = rating.rating;
            });
    }

    existRating() {
        return this.rating !== undefined;
    }

    /**
     * Open the confirm modal to update the current unit to the last version
     */
    openCofirmUpdate() {
        const modal = this.modalService.open(
            ConfirmActionComponent,
            ConfirmActionComponent.options
        );

        const modalData: ModalData = {
            message: 'units.tab-original-unit.non-original.update-confirm.message',
            title: 'units.tab-original-unit.non-original.update-confirm.title',
        };
        modal.componentInstance.data = modalData;

        modal.result
            .then(result => {
                if (result) {
                    this.updating = true;
                    this.unitService.updateNonOriginalUnitVersion(this.unit.id).subscribe(
                        res => {
                            this.toastrService.success(
                                'units.tab-original-unit.non-original.updated',
                                'common.success'
                            );

                            this.actionResult.emit({
                                messageKey: 'units.tab-original-unit.non-original.updated',
                                type: ActionResultEventType.SUCCESS,
                                data: this.unit.id,
                            });

                            this.updating = false;
                        },
                        err => {
                            this.updating = false;
                        }
                    );
                }
            })
            .catch(reason => {});
    }

    /**
     * View the original unit link
     *
     * @param resource Unit resource
     */
    previewUnit(resource: string) {
        return this.resourceService.buildOpenPublishedURL(resource);
    }

    onRateChange(event: any) {
        this.textUserRate = this.translateService.instant('rating.current', {
            current: this.userRate,
            max: 5,
        });
        if (this.unit.originalUnit?.id)
            this.ratingService
                .rateUnit(this.unit.originalUnit.id, this.userRate)
                .subscribe((rating: Rating) => {
                    this.rating = rating;
                    this.toastrService.success(
                        'units.tab-original-unit.rated_successfully',
                        'common.success'
                    );
                });
    }

    isVersionOutdated(lastPublished: Date): boolean {
        return moment(lastPublished).isAfter(this.unit.originalUnit?.timeStamp);
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

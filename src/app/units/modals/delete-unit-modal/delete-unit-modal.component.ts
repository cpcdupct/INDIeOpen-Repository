import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Unit } from '@core/models';
import { ChangeThemeService, UnitsService } from '@core/services';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'io-delete-unit-modal',
    templateUrl: './delete-unit-modal.component.html',
    styleUrls: ['./delete-unit-modal.component.scss'],
})
export class DeleteUnitModalComponent implements OnInit {
    public static options: NgbModalOptions = {
        keyboard: false,
        size: 'lg',
        windowClass: 'modal-holder',
    };

    /** Current unit */
    @Input()
    unit!: Unit;

    /** Deleting indicator */
    deleting = false;

    constructor(
        public activeModal: NgbActiveModal,
        private unitsService: UnitsService,
        private themeService: ChangeThemeService
    ) {}

    ngOnInit(): void {}

    cancel() {
        this.activeModal.dismiss();
    }

    delete() {
        this.deleting = true;
        this.unitsService.deleteUnit(this.unit.id).subscribe(
            res => {
                this.activeModal.close(true);
            },
            (err: HttpErrorResponse) => {}
        );
    }

    get appName() {
        const theme = this.themeService.getThemeOrDefault();
        if (theme) return theme.name;
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unit } from '@core/models';
import { ToastrWrapperService } from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteUnitModalComponent } from '../../modals';

@Component({
    selector: 'io-tab-unit-actions',
    templateUrl: './tab-unit-actions.component.html',
    styleUrls: ['./tab-unit-actions.component.scss'],
})
export class TabUnitActionsComponent implements OnInit {
    @Input()
    unit!: Unit;

    private lastUrl!: string;

    constructor(
        private router: Router,
        private modalService: NgbModal,
        private toastrWrapper: ToastrWrapperService,
        private urlService: RouterExtService
    ) {}

    ngOnInit(): void {
        this.urlService.previousUrl$.subscribe((previousUrl: string) => {
            this.lastUrl = previousUrl;
        });
    }

    openDeleteUnitModal() {
        const modal = this.modalService.open(
            DeleteUnitModalComponent,
            DeleteUnitModalComponent.options
        );

        modal.componentInstance.unit = this.unit;

        modal.result
            .then(result => {
                if (result) {
                    this.toastrWrapper.success(
                        'units.tab-unit-actions.messages.unit_deleted',
                        'common.success'
                    );

                    this.router.navigateByUrl(this.lastUrl !== '/' ? this.lastUrl : '/units');
                }
            })
            .catch(reason => {});
    }
}

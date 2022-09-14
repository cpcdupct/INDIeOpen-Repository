import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ModalData } from '../../models';

/**
 * Loading modal component
 */
@Component({
    selector: 'io-loading-modal',
    templateUrl: './loading-modal.component.html',
    styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {
    /** Modal options */
    public static options: NgbModalOptions = {
        keyboard: false,
        windowClass: 'modal-holder',
        backdrop: 'static',
    };

    /** Modal data */
    @Input()
    data!: ModalData;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {}
}

import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ModalData } from '../../models/modal.model';

/**
 *  Modal containing a URL link
 */
@Component({
    selector: 'io-view-url',
    templateUrl: './view-url.component.html',
    styleUrls: ['./view-url.component.scss'],
})
export class ViewUrlModalComponent implements OnInit {
    /** Modal options */
    static options: NgbModalOptions = {
        windowClass: 'modal-holder view-unit',
        keyboard: true,
    };

    /** Modal data */
    @Input()
    data!: ModalData;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {}
}

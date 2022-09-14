import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ModalData } from '../../models/modal.model';

/**
 * Confirm action modal
 */
@Component({
    selector: 'io-confirm-action',
    templateUrl: './confirm-action.component.html',
    styleUrls: ['./confirm-action.component.scss'],
})
export class ConfirmActionComponent implements OnInit {
    /** Modal options */
    public static options: NgbModalOptions = {
        keyboard: true,
        windowClass: 'modal-holder',
    };

    /** Modal data */
    @Input()
    data!: ModalData;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {}

    /**
     * Close the modal in "cancel" result.
     */
    cancel() {
        this.activeModal.close(false);
    }

    /**
     * Confirm the action in the modal. Close the modal with success result.
     */
    confirm() {
        this.activeModal.close(true);
    }

    confirmButtonStyle() {
        if (this.data.actionDanger) {
            return 'btn-danger';
        }

        return 'btn-primary';
    }
}

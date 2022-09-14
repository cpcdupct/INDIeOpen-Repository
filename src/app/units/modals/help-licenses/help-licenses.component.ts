import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'io-help-licenses',
    templateUrl: './help-licenses.component.html',
    styleUrls: ['./help-licenses.component.scss'],
})
export class HelpLicensesComponent implements OnInit {
    public static options: NgbModalOptions = {
        keyboard: false,
        size: 'lg',
        windowClass: 'modal-holder licenses',
    };

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {}

    closeModal() {
        this.activeModal.dismiss();
    }
}

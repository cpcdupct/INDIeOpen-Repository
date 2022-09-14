import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuestionGroup } from '@core/models';
import { ToastrWrapperService } from '@core/services';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { InputData } from '@shared/models';
import { Utils } from '@shared/utils';

import { maxLengthGroups } from '../../models/validators';

@Component({
    selector: 'io-group-name-modal',
    templateUrl: './group-name-modal.component.html',
})
export class GroupNameModalComponent implements OnInit {
    public static options: NgbModalOptions = {
        keyboard: false,
        windowClass: 'modal-holder',
    };

    @Input()
    existingGroups!: QuestionGroup[];

    formName!: FormGroup;

    groupNameInput: InputData = {
        component: 'questions',
        name: 'groupName',
        label: true,
        type: 'text',
        control: new FormControl('', [Validators.required, Validators.maxLength(250)]),
    };

    constructor(
        private formBuilder: FormBuilder,
        private activeModal: NgbActiveModal,
        private toastrWrapper: ToastrWrapperService
    ) {}

    ngOnInit() {
        this.formName = this.formBuilder.group({
            groupName: this.groupNameInput.control,
        });
    }

    cancel() {
        this.activeModal.close();
    }

    confirm() {
        if (this.formName.valid) {
            if (this.validName()) {
                this.activeModal.close(this.formName.get('groupName')?.value);
            } else {
                this.toastrWrapper.warning(
                    'questions.messages.group_name_already_taken',
                    'common.warning'
                );
            }
        }
    }

    private validName(): boolean {
        return !Utils.findObjectFromArray(
            this.existingGroups,
            'name',
            this.formName.get('groupName')?.value
        );
    }
}

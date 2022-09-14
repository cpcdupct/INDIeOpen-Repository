import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { QuestionGroup } from '@core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormInputComponent } from '@shared/components';

import { GroupNameModalComponent } from './group-name-modal.component';

@Component({
    selector: 'io-input-question-group',
    templateUrl: './input-question-group.component.html',
    styleUrls: ['./input-question-group.component.scss'],
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputQuestionGroupComponent extends FormInputComponent implements OnInit {
    @Input()
    groups!: QuestionGroup[];

    constructor(private modalService: NgbModal) {
        super();
    }

    ngOnInit(): void {}

    createGroup() {
        const modalRef = this.modalService.open(GroupNameModalComponent);
        this.groups = this.groups.filter(g => g.key !== g.name);

        modalRef.componentInstance.existingGroups = this.groups;

        modalRef.result.then(name => {
            if (name) {
                this.groups.push({ key: name, name });
                this.data.control.setValue(name);
            }
        });
    }
}

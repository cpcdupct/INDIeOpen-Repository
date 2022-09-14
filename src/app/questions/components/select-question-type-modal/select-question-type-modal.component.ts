import { Component, OnInit } from '@angular/core';
import { QuestionType } from '@core/models';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

export interface SelectQuestionOption {
    label: string;
    value: string;
}

@Component({
    selector: 'io-select-question-type-modal',
    templateUrl: './select-question-type-modal.component.html',
    styleUrls: ['./select-question-type-modal.component.scss'],
})
export class SelectQuestionTypeModalComponent implements OnInit {
    static options: NgbModalOptions = {
        keyboard: true,
        windowClass: 'modal-holder',
    };

    selectedType: QuestionType = QuestionType.SINGLE_ANSWER;

    types: SelectQuestionOption[] = [
        {
            label: 'questions.types.singleAnswer',
            value: QuestionType.SINGLE_ANSWER,
        },
        {
            label: 'questions.types.multipleAnswer',
            value: QuestionType.MULTIPLE_ANSWER,
        },
        {
            label: 'questions.types.trueFalseAnswer',
            value: QuestionType.TRUE_FALSE,
        },
    ];

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit(): void {}

    cancel() {
        this.activeModal.close();
    }

    confirm() {
        this.activeModal.close(this.selectedType);
    }
}

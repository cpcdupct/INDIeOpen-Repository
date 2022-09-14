import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INDIeError, Question } from '@core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '@shared/modals';
import { ModalData } from '@shared/models';

import { QuestionsService } from '../../services';

@Component({
    selector: 'io-list-question',
    templateUrl: './list-question.component.html',
    styleUrls: ['./list-question.component.scss'],
})
export class ListQuestionComponent implements OnInit {
    @Input()
    item!: Question;

    @Output()
    usedQuestion = new EventEmitter<string>();

    @Output()
    questionDeleted = new EventEmitter<string>();

    constructor(
        private router: Router,
        private questionsService: QuestionsService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {}

    viewQuestion() {
        this.router.navigate(['/questions/edit', { id: this.item.id }]);
    }

    deleteQuestion() {
        const modal = this.modalService.open(
            ConfirmActionComponent,
            ConfirmActionComponent.options
        );

        const data: ModalData = {
            message: 'questions.messages.confirm_delete_question',
        };

        modal.componentInstance.data = data;

        modal.result.then(result => {
            if (result) {
                this.questionsService.deleteQuestion(this.item.id).subscribe(
                    (res: any) => {
                        this.questionDeleted.emit(this.item.id);
                    },
                    (err: HttpErrorResponse) => {
                        if (err.error !== undefined) {
                            const error = err.error as INDIeError;
                            if (error.errorCode === 'USED_QUESTION') {
                                this.usedQuestion.emit(this.item.id);
                            }
                        }
                    }
                );
            }
        });
    }
}

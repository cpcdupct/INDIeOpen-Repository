import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Question, QuestionAnswer, QuestionGroup, QuestionType } from '@core/models';
import { FormErrorHandlerService, ToastrWrapperService } from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import { TranslateService } from '@ngx-translate/core';
import { InputData } from '@shared/models';
import { Utils } from '@shared/utils';

import { QuestionBean } from '../../models';
import { QuestionsService } from '../../services';

@Component({
    selector: 'io-single-answer-form',
    templateUrl: './single-answer-form.component.html',
    styleUrls: ['./single-answer-form.component.scss'],
})
export class SingleAnswerFormComponent implements OnInit {
    /** Form data */
    questionForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;
    component = 'questions';

    /** Form mode */
    @Input()
    formMode = 'CREATE'; // create or update

    /** Question */
    @Input()
    question!: Question;

    /** Groups */
    groups!: QuestionGroup[];

    /** Input data */
    questionTextInput: InputData = {
        component: this.component,
        name: 'text',
        label: true,
        required: true,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(300),
        ]),
    };

    groupInput: InputData = {
        component: this.component,
        name: 'group',
        label: true,
        required: true,
        control: new FormControl('', [Validators.required]),
    };

    tagsInput: InputData = {
        component: this.component,
        name: 'tags',
        label: true,
        control: new FormControl(''),
    };

    private lastUrl!: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private questionsService: QuestionsService,
        private urlService: RouterExtService,
        private toastrWrapper: ToastrWrapperService,
        private formErrorService: FormErrorHandlerService,
        private elementRef: ElementRef,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.questionsService.getlistOfQuestionGroups().subscribe((groups: QuestionGroup[]) => {
            this.groups = groups;
            if (this.formMode === 'UPDATE') this.updateControls();
        });

        this.urlService.previousUrl$.subscribe((previousUrl: string) => {
            this.lastUrl = previousUrl;
        });

        this.loadForm();
    }

    private updateControls() {
        this.questionTextInput.control.setValue(this.question.text);
        this.groupInput.control.setValue(this.groups[0].key);

        this.tagsInput.control.setValue(
            this.question.tags.map(tag => {
                return {
                    display: tag,
                    value: tag,
                };
            })
        );
    }

    private loadForm() {
        this.questionForm = this.formBuilder.group({
            text: this.questionTextInput.control,
            group: this.groupInput.control,
            tags: this.tagsInput.control,
        });
    }

    setAsCorrect(answer: QuestionAnswer) {
        answer.correct = true;
        this.question.answers.forEach(localAnswer => {
            if (localAnswer !== answer) localAnswer.correct = false;
        });
    }

    submit() {
        this.isSubmitted = true;

        if (this.questionForm.invalid) {
            this.questionForm.markAllAsTouched();
            return;
        }

        if (this.areValidAnswers()) {
            // Group and tags
            const group: QuestionGroup = this.findGroupFromValue(this.groupInput.control.value);
            const tags = this.getTagsFromValue(this.tagsInput.control.value);

            // Set the question values
            const questionBean: QuestionBean = {
                text: this.questionTextInput.control.value,
                group: group.key,
                tags,
                answers: this.question.answers,
                type: QuestionType.SINGLE_ANSWER,
            };

            // Call to web service
            let request;
            if (this.formMode === 'UPDATE')
                request = this.questionsService.updateQuestion(this.question.id, questionBean);
            else request = this.questionsService.createQuestion(questionBean);

            this.allowSubmit = false;

            request.subscribe(
                (question: Question) => {
                    this.router.navigateByUrl(this.lastUrl !== '/' ? this.lastUrl : '/questions', {
                        state: { question: this.formMode },
                    });
                },
                (errorResponse: HttpErrorResponse) => {
                    this.formErrorService.handleError(errorResponse);
                    this.allowSubmit = true;
                }
            );
        } else {
            this.toastrWrapper.warning(
                'questions.messages.not_valid_answers.message',
                'common.warning'
            );
        }
    }

    private areValidAnswers(): boolean {
        return this.question.answers.filter(q => !Utils.isStringValid(q.text)).length === 0;
    }

    addAnswer() {
        if (this.question.answers.length === 4) {
            this.toastrWrapper.warning(
                'questions.messages.more_than_4_answers.message',
                'common.warning'
            );
        } else {
            let live = this.elementRef.nativeElement.querySelector('#single-answer-answers-live');
            setTimeout(
                () =>
                    (live.innerHTML = this.translateService.instant(
                        'questions.accesibility.added-answer'
                    )),
                200
            );
            setTimeout(() => (live.innerHTML = ''), 500);

            this.question.answers.push({
                correct: false,
                text: '',
            });
        }
    }

    removeAnswer(answer: QuestionAnswer) {
        if (answer.correct) {
            this.toastrWrapper.warning(
                'questions.messages.delete_correct.message',
                'common.warning'
            );
        } else if (this.question.answers.length > 2) {
            this.question.answers.splice(this.question.answers.indexOf(answer), 1);
            let live = this.elementRef.nativeElement.querySelector('#single-answer-answers-live');
            setTimeout(
                () =>
                    (live.innerHTML = this.translateService.instant(
                        'questions.accesibility.deleted-answer'
                    )),
                200
            );
            setTimeout(() => (live.innerHTML = ''), 500);
        } else {
            this.toastrWrapper.warning(
                'questions.messages.less_than_2_answers.message',
                'common.warning'
            );
        }
    }

    getTagsFromValue(value: any): string[] {
        if (value === '') return [];
        else {
            return value.map((item: any) => {
                return item.display;
            });
        }
    }

    get controls() {
        return this.questionForm.controls;
    }

    findGroupFromValue(value: string): QuestionGroup {
        const group: QuestionGroup = Utils.findObjectFromArray(this.groups, 'key', value);

        return group
            ? group
            : {
                  key: value,
                  name: value,
              };
    }
}

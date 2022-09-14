import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Question, QuestionGroup, QuestionType } from '@core/models';
import { FormErrorHandlerService } from '@core/services';
import { RouterExtService } from '@core/services/router-ext/router-ext.service';
import { InputData } from '@shared/models';
import { Utils } from '@shared/utils';

import { QuestionBean } from '../../models';
import { QuestionsService } from '../../services';

@Component({
    selector: 'io-truefalse-answer-form',
    templateUrl: './truefalse-answer-form.component.html',
    styleUrls: ['./truefalse-answer-form.component.scss'],
})
export class TruefalseAnswerFormComponent implements OnInit {
    /** Form data */
    questionForm!: FormGroup;
    isSubmitted = false;
    allowSubmit = true;
    component = 'questions';

    /** Form mode */
    @Input()
    formMode = 'CREATE'; // create or update

    /** Answers */
    @Input()
    question!: Question;

    @Output()
    questionUpdated = new EventEmitter<string>();

    /** Groups */
    groups!: QuestionGroup[];
    /** Inputs data */
    questionTextInput: InputData = {
        component: this.component,
        name: 'text',
        label: true,
        required: true,
        minLength: 1,
        maxLength: 300,
        control: new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(300),
        ]),
    };

    correctControl: FormControl = new FormControl(true, [Validators.required]);

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
        private questionsService: QuestionsService,
        private router: Router,
        private urlService: RouterExtService,
        private formErrorService: FormErrorHandlerService
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
        this.correctControl.setValue(this.question.correct);
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
            correct: this.correctControl,
            group: this.groupInput.control,
            tags: this.tagsInput.control,
        });
    }

    submit() {
        this.isSubmitted = true;

        if (this.questionForm.valid) {
            // Group and tags
            const group: QuestionGroup = this.findGroupFromValue(this.groupInput.control.value);
            const tags = this.getTagsFromValue(this.tagsInput.control.value);

            // Set the question values
            const questionBean: QuestionBean = {
                text: this.questionTextInput.control.value,
                correct: this.correctControl.value,
                group: group.key,
                tags,
                answers: [],
                type: QuestionType.TRUE_FALSE,
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
            this.questionForm.markAllAsTouched();
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

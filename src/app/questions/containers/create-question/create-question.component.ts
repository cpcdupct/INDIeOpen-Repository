import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question, QuestionAnswer, QuestionType } from '@core/models';

import {
    MultipleAnswerFormComponent,
    SingleAnswerFormComponent,
    TruefalseAnswerFormComponent,
} from '../../components';

@Component({
    selector: 'io-create-question',
    templateUrl: './create-question.component.html',
    styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit, AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef })
    container!: ViewContainerRef;

    type!: QuestionType;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.route.queryParams.subscribe(params => {
            this.type = params.type === undefined ? QuestionType.SINGLE_ANSWER : params.type;
            this.container.clear();

            let factory;
            let ref;

            switch (this.type) {
                case QuestionType.MULTIPLE_ANSWER:
                    factory = this.componentFactoryResolver.resolveComponentFactory(
                        MultipleAnswerFormComponent
                    );
                    ref = this.container.createComponent<MultipleAnswerFormComponent>(factory);
                    break;
                case QuestionType.TRUE_FALSE:
                    factory = this.componentFactoryResolver.resolveComponentFactory(
                        TruefalseAnswerFormComponent
                    );
                    ref = this.container.createComponent<TruefalseAnswerFormComponent>(factory);
                    break;
                case QuestionType.SINGLE_ANSWER:
                default:
                    factory =
                        this.componentFactoryResolver.resolveComponentFactory(
                            SingleAnswerFormComponent
                        );

                    ref = this.container.createComponent<SingleAnswerFormComponent>(factory);

                    break;
            }

            ref.instance.question = this.createEmptyQuestion();
            ref.changeDetectorRef.detectChanges();
        });
    }

    createEmptyQuestion(): Question {
        return {
            id: '0',
            answers: this.createEmptyAnswers(),
            tags: [],
            text: 'Text',
            type: this.type,
        };
    }

    createEmptyAnswers(): QuestionAnswer[] {
        return [
            {
                correct: true,
                text: '',
            },
            {
                correct: false,
                text: '',
            },
        ];
    }
}

import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question, QuestionType } from '@core/models';

import {
    MultipleAnswerFormComponent,
    SingleAnswerFormComponent,
    TruefalseAnswerFormComponent,
} from '../../components';
import { QuestionsService } from '../../services';

@Component({
    selector: 'io-view-question',
    templateUrl: './view-question.component.html',
    styleUrls: ['./view-question.component.scss'],
})
export class ViewQuestionComponent implements OnInit, AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef })
    container!: ViewContainerRef;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private questionsService: QuestionsService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.route.params.subscribe(params => {
            const questionId: string = params.id;

            this.questionsService.getQuestionDetail(questionId).subscribe(
                (question: Question) => {
                    this.loadFormComponent(question);
                },
                err => {}
            );
        });
    }

    private loadFormComponent(question: Question) {
        this.container.clear();
        let factory;
        let ref;

        switch (question.type) {
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

        ref.instance.question = question;
        ref.instance.formMode = 'UPDATE';
        ref.changeDetectorRef.detectChanges();
    }
}

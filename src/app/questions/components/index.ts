import { GroupNameModalComponent } from './input-question-group/group-name-modal.component';
import { InputQuestionGroupComponent } from './input-question-group/input-question-group.component';
import { ListQuestionComponent } from './list-question/list-question.component';
import { MultipleAnswerFormComponent } from './multiple-answer-form/multiple-answer-form.component';
import { SelectQuestionTypeModalComponent } from './select-question-type-modal/select-question-type-modal.component';
import { SingleAnswerFormComponent } from './single-answer-form/single-answer-form.component';
import { TruefalseAnswerFormComponent } from './truefalse-answer-form/truefalse-answer-form.component';

export const components = [
    ListQuestionComponent,
    MultipleAnswerFormComponent,
    SingleAnswerFormComponent,
    TruefalseAnswerFormComponent,
    SelectQuestionTypeModalComponent,
    InputQuestionGroupComponent,
    GroupNameModalComponent,
];

export * from './list-question/list-question.component';
export * from './truefalse-answer-form/truefalse-answer-form.component';
export * from './single-answer-form/single-answer-form.component';
export * from './multiple-answer-form/multiple-answer-form.component';
export * from './select-question-type-modal/select-question-type-modal.component';
export * from './input-question-group/input-question-group.component';
export * from './input-question-group/group-name-modal.component';

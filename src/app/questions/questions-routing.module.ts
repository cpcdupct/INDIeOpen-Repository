import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

import { RouteData } from '../navigation/models';

import * as questionsContainers from './containers';
import { QuestionsModule } from './questions.module';

export const ROUTES: Routes = [
    {
        path: '',
        data: {
            title: 'questions.my_questions.title',
            breadcrumbs: [
                {
                    key: 'questions.my_questions.title',
                    active: true,
                },
            ],
        } as RouteData,
        canActivate: [AuthGuard],
        component: questionsContainers.QuestionsComponent,
    },
    {
        path: 'create',
        canActivate: [AuthGuard],
        component: questionsContainers.CreateQuestionComponent,
        data: { title: 'questions.create_question.title' },
    },
    {
        path: ':id/edit',
        data: { title: 'questions.update_question.title' },
        canActivate: [AuthGuard],
        component: questionsContainers.ViewQuestionComponent,
    },
];

@NgModule({
    imports: [QuestionsModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class QuestionsRoutingModule {}

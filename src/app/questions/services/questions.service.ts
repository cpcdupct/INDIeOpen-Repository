import { Injectable } from '@angular/core';
import { Question, QuestionGroup } from '@core/models';
import { ApiService, AuthService } from '@core/services';
import { createPageResponse, Page, PAGE_DEFAULT_SIZE } from '@shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { QuestionBean, QuestionItem } from '../models';

@Injectable({
    providedIn: 'root',
})
export class QuestionsService {
    constructor(private api: ApiService, private authService: AuthService) {}

    findQuestions(page: number, requestParams?: any): Observable<Page<QuestionItem>> {
        let params: any = {
            page: page - 1,
            size: PAGE_DEFAULT_SIZE,
        };

        if (requestParams.sort) params.sort = requestParams.sort;

        if (requestParams) params = { ...params, ...requestParams };

        return this.api
            .get<Page<QuestionItem>>('/indieopen/questions', this.auth(), params)
            .pipe(map(res => createPageResponse(res)));
    }

    getlistOfQuestionGroups(): Observable<QuestionGroup[]> {
        return this.api.get<QuestionGroup[]>('/indieopen/questions/groups', this.auth());
    }

    updateQuestion(id: string, question: QuestionBean): Observable<Question> {
        return this.api.put<Question>('/indieopen/questions/update/' + id, question, this.auth());
    }

    createQuestion(question: QuestionBean): Observable<Question> {
        return this.api.post<Question>('/indieopen/questions/', question, this.auth());
    }

    getQuestionDetail(questionId: string): Observable<Question> {
        return this.api.get<Question>('/indieopen/questions/detail/' + questionId, this.auth());
    }

    deleteQuestion(id: string) {
        return this.api.delete('/indieopen/questions/delete/' + id, this.auth());
    }

    private auth() {
        return this.authService.getCurrentUser().access_token;
    }
}

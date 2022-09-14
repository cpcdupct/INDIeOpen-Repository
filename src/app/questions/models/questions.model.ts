import { QuestionAnswer } from '@core/models';

export interface QuestionItem {
    id: number;
    createdAt: Date;
    updatedAt?: Date;
    information: {
        name: string;
        type: string;
        answer: [
            {
                text: string;
                correct: boolean;
            }
        ];
        tags: string[];
        group: string;
    };
}

export interface QuestionBean {
    type: string;
    text: string;
    answers: QuestionAnswerBean[];
    tags: string[];
    group?: string;
    correct?: boolean;
}

export interface QuestionAnswerBean {
    text: string;
    correct: boolean;
}

export interface AnswerViewmodel {
    id: number;
    answer: QuestionAnswer;
}

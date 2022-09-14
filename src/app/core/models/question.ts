/** File that contains common models for managing the domain concept: Question*/

/** Question group */
export interface QuestionGroup {
    /** Group key */
    key: string;
    /** Group name */
    name: string;
}

/** Question answer */
export interface QuestionAnswer {
    /** Answer text */
    text: string;
    /** Correct answer */
    correct: boolean;
}

/** Question types */
export enum QuestionType {
    TRUE_FALSE = 'TrueFalse',
    SINGLE_ANSWER = 'SingleAnswer',
    MULTIPLE_ANSWER = 'MultipleAnswer',
}

/** Question concept */
export interface Question {
    /** Question id */
    id: string;
    /** Question type */
    type: QuestionType;
    /** Question text */
    text: string;
    /** Array of answers */
    answers: QuestionAnswer[];
    /** Question tags */
    tags: string[];
    /** Question group if any */
    group?: QuestionGroup;
    /** Question in true/false question */
    correct?: boolean;
}

export interface CreateUnitModel {
    name: string;
    shortDescription: string;
    longDescription?: string;
    type: string;
    language: string;
    category: string;
    ageRange: number[];
    educationalContext: any[];
    tags: any[];
    cover: string;
    theme: string;
}

export interface UpdateUnitInfoModel {
    name: string;
    shortDescription: string;
    longDescription?: string;
    language: string;
    category: string;
    ageRange: number[];
    educationalContext: any[];
    tags: any[];
    cover: string;
    theme: string;
}

export interface LTIUser {
    name: string;
    email: string;
}

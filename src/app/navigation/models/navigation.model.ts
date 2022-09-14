/** UNNECESARY: Route data */
// TODO eliminar
export interface RouteData {
    breadcrumbs: Breadcrumb[];
}

/** UNNECESARY: Breadcrumb data */
// TODO eliminar
export interface Breadcrumb {
    key: string;
    link?: string;
    active?: boolean;
}

/** Login bean to make the login request */
export interface LoginBean {
    /** User's name */
    username: string;
    /** User's password */
    password: string;
}

/** Mobile menu direction  */
export enum MenuDirection {
    Left = 'left',
    Right = 'right',
}

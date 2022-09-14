/**
 * Interface of a JWT authorzation request
 */
export interface AuthResponse {
    /** JWT Access token */
    access_token: string;
    /** JWT Token type */
    token_type: string;
    /** JWT Refresh token */
    refresh_token: string;
    /** Token expiration  */
    expires_in: number;
    /** Application scope */
    scope: string;
    /** User's surname */
    apellido: string;
    /** User's name */
    nombre: string;
    /** User's email */
    correo: string;
    /** User id */
    id: string;
    /** Token identifier */
    jti: string;
    /** User's avatar URL */
    avatar: string;
}

/** Current user interface (user logged in)  */
export interface UserInfo {
    /** JWT Access token */
    access_token: string;
    /** JWT Refresh token */
    refresh_token: string;
    /** User completename */
    completeName: string;
    /** Current username */
    username: string;
    /** User id */
    id: string;
    /** User avatar */
    avatar?: string;
    /** User tenant */
    tenant?: string;
}

/** Cookie user data */
export interface CookieUser {
    /** JWT Access token */
    access_token: string;
    /** JWT Refresh token */
    refresh_token: string;
    /** User id */
    id: string;
    /** User tenant */
    tenant: string;
}

/**
 * Create a cookie user data from user info.
 *
 * @param userInfo Userinfo instance
 *
 * @returns A cookie user ready to be stored in a cookie.
 */
export function createCookieUserFromUserInfo(userInfo: UserInfo): CookieUser {
    return {
        access_token: userInfo.access_token,
        id: userInfo.id,
        tenant: userInfo.tenant ? userInfo.tenant : 'MY_TENANT',
        refresh_token: userInfo.refresh_token,
    };
}

/** Author information */
export interface AuthorResource {
    /** Author id */
    id: string;
    /** Author email */
    email: string;
    /** Author complete name */
    name: string;
}

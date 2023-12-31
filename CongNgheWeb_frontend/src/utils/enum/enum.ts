export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

export const LOCALE_KEY = 'LOCALE__';

export const THEME_KEY = 'THEME__';

export const USER_INFO_KEY = 'USER__INFO__';

export const ROLES_KEY = 'ROLES__KEY__';
export const IS_LOCKSCREEN = 'IS_LOCKSCREEN';
export const TABS_ROUTES = 'TABS_ROUTES';

export enum ResultEnum {
    SUCCESS = 0,
    ERROR = -1,
    TIMEOUT = 10042,
    TYPE = 'success'
}

export enum RequestEnum {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum RoleEnum {
    Admin = 'Admin',
    Student = 'Student',
    Professor = 'Professor'
}
export enum State {
    Public = 'Public',
    Private = 'Private'
}
export class File {
    fileUrl: string | undefined;
    filePath!: string | undefined;
}

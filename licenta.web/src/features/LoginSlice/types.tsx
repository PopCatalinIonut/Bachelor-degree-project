export interface LoggedUserDetails{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface LoginCredentials{
    username: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials{
    lastName: string;
    firstName: string;
    email: string;
}
import { Post } from "../components/types";

export interface LoggedUserDetails{
    id: number;
    loginUsername: string;
    firstName: string;
    lastName: string;
    email: string;
    postedPosts: Post[],
    wishlist: Post[]
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
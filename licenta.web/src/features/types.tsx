import { DisplayMessage, Post, PostUserDetails } from "../components/types";

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

export interface Conversation {
    recipient: PostUserDetails;
    messages: DisplayMessage[];
}

export interface GenerateOutfitProps{
    userId: number;
    maximumCost?: string;
    brand?: string;
    season?: string;
    genre?: string;
    clothingSize?: string;
    shoeSize?: string;
    colorPalette?: string;
    postId?: string;
}

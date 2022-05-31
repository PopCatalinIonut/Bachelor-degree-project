import { AddSellingItem, ColorSchema, DisplayMessage, ItemImage, Post, PostUserDetails } from "../components/types";

export interface LoggedUserDetails{
    id: number;
    loginUsername: string;
    first_name: string;
    last_name: string;
    email: string;
    postedPosts: Post[],
    wishlist: Post[]
}

export interface LoggedUserDetailsResponse extends Omit<LoggedUserDetails, 'first_name'|'last_name'>{
    firstName: string;
    lastName: string;
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

export interface PostUserReponse{
    firstName: string;
    lastName: string;
    id: number;
}

export interface GenerateOutfitProps{
    userId: number;
    maximumValue?: number;
    condition?: string;
    season?: string;
    genre?: string;
    clothingSize?: string;
    shoeSize?: string;
    colorPalette?: string;
    postId?: string;
}

export interface PostResponse extends Omit<Post,"is_active"|"location"|"item"|"seller">{
    isActive: boolean;
    cityLocation: string;
    item: ItemResponse;
    seller: PostUserReponse;
}

export interface ItemResponse extends Omit<AddSellingItem,"images"|"colors"> {
    colorSchema: ColorSchema;
    images: ItemImage[];
    id: number;
  }
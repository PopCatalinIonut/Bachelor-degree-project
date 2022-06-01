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

export interface LoggedUserDetailsResponse extends Omit<LoggedUserDetails, 'first_name'|'last_name'|'postedPosts'|'wishlist'>{
    firstName: string;
    lastName: string;
    postedPosts: PostResponse[],
    wishlist: PostResponse[]
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

export interface ConversationResponse{
    recipient: PostUserReponse;
    messages: DisplayMessageResponse[];
}

export interface DisplayMessageResponse{
    id: number;
    sender: PostUserReponse;
    receiver: PostUserReponse;
    text: string;
    date: Date;
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

export const convertFromPostResponseToPost =(post: PostResponse) =>{
    return {
      id: post.id,
      is_active: post.isActive,
      description: post.description,
      location: post.cityLocation,
      item: {
        color_schema: {colors: post.item.colorSchema.colors},
        images: post.item.images,
        id: post.item.id,
        name: post.item.name,
        size: post.item.size,
        fit: post.item.fit,
        genre: post.item.genre,
        price: post.item.price,
        type: post.item.type,
        category: post.item.category,
        brand: post.item.brand,
        condition: post.item.condition
      },
      seller: {
        id: post.seller.id,
        first_name: post.seller.firstName,
        last_name: post.seller.lastName
      }
    }
  }
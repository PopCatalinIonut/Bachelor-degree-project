import { LoggedUserDetailsResponse, PostResponse } from "../features/types";

export interface AddSellingItem {
    name: string;
    type: string;
    category: string;
    genre: string;
    size: string;
    brand: string;
    fit: string;
    condition: string;
    price: number;
    colors: string[];
    images: Blob[];
}

export interface SellingItem extends Omit<AddSellingItem,"images"|"colors"> {
  color_schema: ColorSchema;
  images: ItemImage[];
  id: number;
}

export interface ItemImage{
    id: number;
    item_id: number;
    link: string;
}

export interface AddPost{
    item: AddSellingItem;
    userId: number;
    description: string;
    location: string;
}

export interface Post extends Omit<AddPost,"item"|"userId">{
    id: number;
    item: SellingItem;  
    seller: PostUserDetails;
    is_active: boolean;
}

export interface SellingItemEncoded extends Omit<AddSellingItem, 'images'> {
    images: string[]
    
}
export interface PostEncoded extends Omit<AddPost, 'item'> {
    item: SellingItemEncoded
}

export interface PostUserDetails {
    first_name: string;
    last_name: string;
    id: number;
}

export interface DisplayMessage{
    id: number;
    sender: PostUserDetails;
    receiver: PostUserDetails;
    text: string;
    date: Date;
}

export interface PostUserDetailsResponse{
    firstName: string;
    lastName: string;
    id: number;
}

export interface DisplayMessageResponse extends Omit<DisplayMessage,"sender"|"receiver">{
    sender: PostUserDetailsResponse;
    receiver: PostUserDetailsResponse;
}

export interface SendMessage{
    senderId: number;
    receiverId: number;
    text: string;
}

export interface ColorSchema{
    colors: string[]
}

export interface Outfit{
    components: OutfitComponent[];
}

export interface OutfitResponse{
    components: OutfitComponentResponse[];
}

export interface OutfitComponentResponse{
    type: string;
    post: PostResponse | null
}
export interface OutfitComponent{
    type: string;
    post: Post | null
}
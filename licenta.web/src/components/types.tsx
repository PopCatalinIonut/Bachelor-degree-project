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
  colorSchema: ColorSchema;
  images: ItemImage[];
  id: number;
}

export interface ItemImage{
    id: number;
    itemId: number;
    link: string;
}

export interface AddPost{
    item: AddSellingItem;
    userId: number;
    description: string;
    cityLocation: string;
}

export interface Post extends Omit<AddPost,"item"|"userId">{
    id: number;
    item: SellingItem;  
    seller: PostUserDetails;
    isActive: boolean;
}

export interface SellingItemEncoded extends Omit<AddSellingItem, 'images'> {
    images: string[]
    
}
export interface PostEncoded extends Omit<AddPost, 'item'> {
    item: SellingItemEncoded
}

export interface PostUserDetails {
    firstName: string;
    lastName: string;
    id: number;
}

export interface DisplayMessage{
    id: number;
    sender: PostUserDetails;
    receiver: PostUserDetails;
    text: string;
    date: Date;
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

export interface OutfitComponent{
    type: string;
    post: Post | null
}
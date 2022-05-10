export interface AddSellingItem {
    name: string;
    type: string;
    category: string;
    genre: string;
    size: string;
    fit: string;
    condition: string;
    price: number;
    color: string;
    images: Blob[];
}

export interface SellingItem extends Omit<AddSellingItem,"images"> {
  images: ItemImage[]
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

export interface Post extends Omit<AddPost,"item">{
 item: SellingItem;  
}

export interface SellingItemEncoded extends Omit<AddSellingItem, 'images'> {
    images: string[]
    
}
export interface PostEncoded extends Omit<Post, 'item'> {
    item: SellingItemEncoded
}
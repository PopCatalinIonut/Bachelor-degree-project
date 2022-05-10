
export interface SellingItem {
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

export interface Post{
    item: SellingItem;
    userId: number;
    description: string;
    cityLocation: string;
}
export interface SellingItemEncoded extends Omit<SellingItem, 'images'> {
    images: string[]
    
}
export interface PostEncoded extends Omit<Post, 'item'> {
    item: SellingItemEncoded
}
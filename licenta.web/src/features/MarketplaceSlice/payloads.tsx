import { Post } from "../../components/types";


export interface SetInitialMarketplaceSliceStatePayload {
  posts: Post[];
}

export interface AddItemToWishlistPayload {
  userId: number;
  postId: number;
}
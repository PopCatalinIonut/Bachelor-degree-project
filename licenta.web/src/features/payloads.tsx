import { DisplayMessage, Post } from "../components/types";
import { LoggedUserDetails } from "./types";

export interface SetInitialUserSliceStatePayload {
  user: LoggedUserDetails;
}

export interface SetInitialMarketplaceSliceStatePayload {
  posts: Post[];
}

export interface AddItemToWishlistPayload {
  userId: number;
  postId: number;
}


export interface SetInitialMessageSliceStatePayload {
  messages: DisplayMessage[]
}
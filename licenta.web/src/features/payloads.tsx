import { DisplayMessage, Post } from "../components/types";
import { Conversation, LoggedUserDetails } from "./types";

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

export interface GetUserMessagesPayload{
  userId: number;
  connectionId: string;
}

export interface SetInitialMessageSliceStatePayload {
  conversations: Conversation[]
}

export interface UpdatePostActiveStatusPayload{
  postId: number;
  status: boolean;
}
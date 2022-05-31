import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Post, PostEncoded, PostUserDetails, SellingItem } from "../../components/types";
import { AddItemToWishlistPayload, SetInitialMarketplaceSliceStatePayload, UpdatePostActiveStatusPayload } from "../payloads";
import { PostResponse } from "../types";

export interface MarketplaceConfigurationState {
  posts: Post[];
  initialized: boolean;
}
const initialState: MarketplaceConfigurationState = {
  initialized: false,
  posts: []
};
export const getAllPosts = createAsyncThunk(
  "features/MarketplaceSlice/getAllPosts",
  async() =>{
    try{
      const response = await axios.get<PostResponse[]>("http://localhost:7071/api/posts");
      var posts: Post[] = [];
      response.data.forEach((post) => {
        posts.push({
          id: post.id,
          description: post.description,
          location: post.cityLocation,
          is_active: post.isActive,
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
        })
      });
      console.log(posts)
      return posts;
    }
  catch (err: any) {
    return err.response.data;
    }
  }
);

export const UpdatePostActiveStatus = createAsyncThunk(
  "features/MarketplaceSlice/updatePostActiveStatus",
  async(props : UpdatePostActiveStatusPayload, {rejectWithValue}) =>{
    try{
         const response = await axios.patch<Post>("http://localhost:7071/api/posts/".concat(props.postId.toString().concat("/")+props.status.toString()));
         console.log(response);
      return "Ok";
    }catch (err: any) {
      return rejectWithValue(err.response.data);
      }
  }
)

export const DeletePost = createAsyncThunk(
  "features/MarketplaceSlice/deletePost",
  async(props : number, {rejectWithValue}) =>{
    try{
         const response = await axios.delete<Post>("http://localhost:7071/api/posts/".concat(props.toString()));
         console.log(response);
      return "Ok";
    }catch (err: any) {
      return rejectWithValue(err.response.data);
      }
  }
)

export const AddItemToWishlist = createAsyncThunk(
  "features/MarketplaceSlice/addItemToWishlist",
  async(props : AddItemToWishlistPayload, {rejectWithValue}) =>{
    try{
          await axios.post<Post>("http://localhost:7071/api/posts/wishlist",{
          userId: props.userId,
          postId: props.postId
        })
      return "Ok";
    }catch (err: any) {
      return rejectWithValue(err.response.data);
      }
  }
)

export const RemoveItemFromWishlist = createAsyncThunk(
  "features/MarketplaceSlice/removeItemFromWishlist",
  async(props : AddItemToWishlistPayload, {rejectWithValue}) =>{
    try{
         await axios.delete<AddItemToWishlistPayload>("http://localhost:7071/api/posts/wishlist/post/"
         .concat(props.postId.toString()).concat("/user/").concat(props.userId.toString()));
      return "Ok";
    }catch (err: any) {
      return rejectWithValue(err.response.data);
      }
  }
)

export const addItemToMarketplace = createAsyncThunk(
  "features/MarketplaceSlice/addItemToMarketplace",
  async (post: PostEncoded, { rejectWithValue }) => {
    try{ 
       const response = await axios.post<Post>("http://localhost:7071/api/posts",
       { item: {
          name: post.item.name,
          brand: post.item.brand,
          type: post.item.type,
          category: post.item.category,
          genre: post.item.genre,
          size: post.item.size,
          fit: post.item.fit,
          condition: post.item.condition,
          price: Number(post.item.price),
          images: post.item.images,
          colors: post.item.colors
      },
      cityLocation: post.location,
      description: post.description,
      userId : post.userId
    });    
    console.log(response.data.id !== null)
      return response.data;
    }
    catch (err: any) {
    return rejectWithValue(err.response.data);
    }
  }
);

export const marketplaceSlice = createSlice({
    name: "marketplaceItemsSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<SetInitialMarketplaceSliceStatePayload>) => {
        state.posts = action.payload.posts;
        state.initialized = true;
      },
    },
    extraReducers: builder => {
      builder
        .addCase(addItemToMarketplace.fulfilled, (state, action) => {
          console.log(action.payload)
        })
        .addCase(getAllPosts.fulfilled,(state,action) =>{
          state.posts = action.payload;
        })
    },
  });

export const {
  setInitialState,
} = marketplaceSlice.actions;
  
export const marketplaceItemsSelector = (state: RootState) => state.marketplaceSlice.posts;
export default marketplaceSlice.reducer;

  
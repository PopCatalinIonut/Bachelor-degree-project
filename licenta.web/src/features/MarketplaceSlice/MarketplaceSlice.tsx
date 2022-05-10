import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Post, PostEncoded } from "../../components/types";
import { SetInitialMarketplaceSliceStatePayload } from "./payloads";

export interface MarketplaceConfigurationState {
  posts: Post[] | null;
  initialized: boolean;
}
const initialState: MarketplaceConfigurationState = {
    initialized: false,
    posts: null
};
export const addItemToMarketplace = createAsyncThunk(
  "features/MarketplaceSlice/addItemToMarketplace",
  async (post: PostEncoded, { rejectWithValue }) => {
    try{ 
      console.log(post.item.images)
       const response = await axios.post<Post>("http://localhost:7071/api/posts",
       { item: {
          name: post.item.name,
          type: post.item.type,
          category: post.item.category,
          genre: post.item.genre,
          size: post.item.size,
          fit: post.item.fit,
          condition: post.item.condition,
          price: Number(post.item.price),
          color: post.item.color,
          images: post.item.images
      },
      cityLocation: post.cityLocation,
      description: post.description,
      userId : post.userId
    });
      return "";
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
        });
    },
  });

export const {
  setInitialState,
} = marketplaceSlice.actions;
  
export const marketplaceItemsSelector = (state: RootState) => state.marketplaceSlice.posts;
export default marketplaceSlice.reducer;

  
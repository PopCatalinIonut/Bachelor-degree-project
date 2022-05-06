import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { SellingItem } from "../../components/types";
import { SetInitialMarketplaceSliceStatePayload } from "./payloads";

export interface MarketplaceConfigurationState {
  items: SellingItem[] | null;
  initialized: boolean;
}
const initialState: MarketplaceConfigurationState = {
    initialized: false,
    items: null
};

export const addItemToMarketplace = createAsyncThunk(
  "features/MarketplaceSlice/addItemToMarketplace",
  async (item: SellingItem, { rejectWithValue }) => {
  
    try{ 
       const response = await axios.post<SellingItem>("http://localhost:7071/api");
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
        state.items = action.payload.items;
        state.initialized = true;
      },
    },
    extraReducers: builder => {
      builder
        //.addCase(.fulfilled, (state, action) => {
       // });
    },
  });

export const {
  setInitialState,
} = marketplaceSlice.actions;
  
export const marketplaceItemsSelector = (state: RootState) => state.marketplaceSlice.items;
export default marketplaceSlice.reducer;

  
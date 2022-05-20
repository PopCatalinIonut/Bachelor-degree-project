import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import { Post } from "../components/types";
import { GenerateOutfitProps } from "./types";

export interface MessagesConfigurationState {
    outfit: Post[];
    initialized: boolean;
  }

  const initialState: MessagesConfigurationState = {
    initialized: false,
    outfit: [],
};


export const generateOutfit = createAsyncThunk(
    "features/OutfitSlice/generateOutfit",
    async(props: GenerateOutfitProps) =>{
      try{
        const response = await axios.post<Post[]>("http://localhost:7071/api/outfit",{
            userId: props.userId,
            brand: props.brand,
            maximumCost: props.maximumCost,
            season: props.season,
            genre: props.genre,
            clothingSize: props.clothingSize,
            shoeSize: props.shoeSize,
            colorPalette: props.colorPalette,
            postI: props.postId
          }
        );
        var conversations: Post[] = response.data;
        return conversations;
      }
    catch (err: any) {
      return err.response.data;
      }
    }
  );

export const outfitSlice = createSlice({
    name: "outfitSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<Post[]>) => {
        state.outfit = action.payload;
        state.initialized = true;
      },
      addItemToGenerator: (state, action:PayloadAction<Post>) =>{
        if(state.outfit.length === 0)
            state.outfit.push(action.payload);
        else 
            state.outfit = [action.payload];
          
        console.log("added")
        console.log(action.payload)
      }
    },
    extraReducers: builder => {
      builder
        .addCase(generateOutfit.fulfilled, (state, action) => {
          state.outfit = action.payload;
        })
    },
  });

export const {
    setInitialState,
    addItemToGenerator
} = outfitSlice.actions;


export const outfitSelector = (state: RootState) => state.outfitSlice.outfit;

export default outfitSlice.reducer
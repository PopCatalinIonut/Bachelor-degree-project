import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import { Outfit, Post } from "../components/types";
import { GenerateOutfitProps } from "./types";

export interface OutfitConfigurationState {
    outfit: Outfit;
    initialized: boolean;
  }

  const initialState: OutfitConfigurationState = {
    initialized: false,
    outfit: {components: [{type:"Footwear",post:null},{type:"Pants",post:null},{type:"Top",post:null}]},
};


export const generateOutfit = createAsyncThunk(
    "features/OutfitSlice/generateOutfit",
    async(props: GenerateOutfitProps) =>{
      try{
        const response = await axios.post<Outfit>("http://localhost:7071/api/outfits",{
            userId: props.userId,
            condition: props.condition,
            maximumValue: props.maximumValue,
            season: props.season,
            genre: props.genre,
            clothingSize: props.clothingSize,
            shoeSize: props.shoeSize,
            colorPalette: props.colorPalette,
            postId: props.postId
          }
        );
        var outfit: Outfit = response.data;
        return outfit;
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
      addItemToGenerator: (state, action:PayloadAction<Post>) =>{
        var item = action.payload.item
        switch (item.type)
        {
            case "Footwear": 
                var component = state.outfit.components.find(x => x.type === "Footwear");
                  if(component!==undefined) 
                  component.post = action.payload;
                break;
            case "Clothing":
                switch (item.category)
                {
                    case "Shorts" || "Pants":
                      var component = state.outfit.components.find(x => x.type === "Pants");
                      if(component!==undefined) component.post = action.payload;
                        break;
                    case "Hoodies" || "T-Shirts" || "Sweatshirts":
                      var component = state.outfit.components.find(x => x.type === "Top");
                      if(component!==undefined) component.post = action.payload;
                        break;
                }
                break;
        }
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
    addItemToGenerator
} = outfitSlice.actions;


export const outfitSelector = (state: RootState) => state.outfitSlice.outfit;
export default outfitSlice.reducer
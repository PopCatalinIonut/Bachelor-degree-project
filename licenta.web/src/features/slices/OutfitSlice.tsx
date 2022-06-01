import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Outfit, OutfitComponent, OutfitComponentResponse, OutfitResponse, Post } from "../../components/types";
import { convertFromPostResponseToPost, GenerateOutfitProps } from "../types";

export interface OutfitConfigurationState {
    outfit: Outfit;
    itemToGenerateWith: OutfitComponent;
    initialized: boolean;
    succes: boolean;
  }

  const initialState: OutfitConfigurationState = {
    initialized: false,
    itemToGenerateWith: {post:null,type:""},
    outfit: {components: [{type:"Footwear",post:null},{type:"Pants",post:null},{type:"Top",post:null}]},
    succes: false
};


export const generateOutfit = createAsyncThunk(
    "features/OutfitSlice/generateOutfit",
    async(props: GenerateOutfitProps, {rejectWithValue}) =>{
      try{
        const response = await axios.post<OutfitResponse>("http://localhost:7071/api/outfits",{
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
        var outfit: Outfit = {components:[]};
        response.data.components.forEach((comp: OutfitComponentResponse) =>{ 
          outfit.components.push({type: comp.type,post: comp.post === null ? null : convertFromPostResponseToPost(comp.post)})})
        return outfit;
      }
      catch (err: any) {
        return rejectWithValue(err.response.data);
        }
    }
  );

export const outfitSlice = createSlice({
    name: "outfitSlice",
    initialState,
    reducers: {
      addItemToGenerator: (state, action:PayloadAction<Post>) =>{
        var itemToAdd = {post: action.payload,type:""};
        switch (action.payload.item.type)
        {
          case "Footwear": 
            var component = state.outfit.components.find(x => x.type === "Footwear");
              if(component!==undefined) {
                console.log("added item in slice")
                component.post = action.payload;
                itemToAdd.type = "Footwear";
              }
            break;
          case "Clothing":
            switch (action.payload.item.category)
            {
              case "Shorts" || "Pants":
                var component = state.outfit.components.find(x => x.type === "Pants");
                if(component!==undefined) {
                  component.post = action.payload;
                  itemToAdd.type = "Pants"
                }
                  break;
              case "Hoodies" || "T-Shirts" || "Sweatshirts":
                var component = state.outfit.components.find(x => x.type === "Top");
                if(component!==undefined) {
                  component.post = action.payload;
                  itemToAdd.type = "Top"
                }
                  break;
              }
            break;
        }
        state.itemToGenerateWith = itemToAdd;
      }, removeItemFromGenerator: (state, action:PayloadAction<number>) =>{
        state.itemToGenerateWith =  {post:null,type:""};
      }
    },
    extraReducers: builder => {
      builder
        .addCase(generateOutfit.fulfilled, (state, action) => {
          var itemsGeneratedWithSucces = 0;
          action.payload.components.forEach((c) => {
            if(c.post !==null) 
              itemsGeneratedWithSucces++
          })
          if(itemsGeneratedWithSucces > 1)
            {
              Object.assign(  state.outfit = action.payload);
              state.succes = true;
            }
          else {
            state.outfit.components.forEach((x) => {
            if(x.post !== null && state.itemToGenerateWith.post?.id !== x.post.id)
                x.post = null;
            })
            state.succes = false}
        })
    },
  });

export const {
    addItemToGenerator,
    removeItemFromGenerator
} = outfitSlice.actions;


export const outfitSelector = (state: RootState) => state.outfitSlice.outfit;
export const itemToGenerateWithSelector = (state:RootState) => state.outfitSlice.itemToGenerateWith;
export const succesSelector = (state:RootState) => state.outfitSlice.succes
export default outfitSlice.reducer
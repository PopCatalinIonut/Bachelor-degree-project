import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";
import { DisplayMessage, SendMessage } from "../components/types";
import { SetInitialMessageSliceStatePayload } from "./payloads";

export interface MessagesConfigurationState {
    messages: DisplayMessage[];
    initialized: boolean;
  }
  const initialState: MessagesConfigurationState = {
    initialized: false,
    messages: []
  };

  export const getUserMessages = createAsyncThunk(
    "features/MarketplaceSlice/getAllPosts",
    async(userId: number) =>{
      try{
        const response = await axios.get<DisplayMessage[]>("http://localhost:7071/api/messages/".concat(userId.toString()));
        var messages: DisplayMessage[] = response.data;
        console.log(messages);
        return messages;
      }
    catch (err: any) {
      return err.response.data;
      }
    }
  );

  export const sendMessage = createAsyncThunk(
    "features/MessageSlice/sendMessage",
    async(props : SendMessage, {rejectWithValue}) =>{
      try{
           const response = await axios.post<DisplayMessage>("http://localhost:7071/api/messages",{
           senderId: props.senderId,
           receiverId: props.receiverId,
           text: props.text
          })
         console.log(response.data)
        return {
          id: response.data.id,
          sender: response.data.sender,
          receiver: response.data.receiver,
          text: response.data.text,
          date: response.data.date
        };
      }catch (err: any) {
        return rejectWithValue(err.response.data);
        }
    }
  )

export const messageSlice = createSlice({
    name: "messageSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<SetInitialMessageSliceStatePayload>) => {
        state.messages = action.payload.messages;
        state.initialized = true;
      },
    },
    extraReducers: builder => {
      builder
        .addCase(getUserMessages.fulfilled, (state, action) => {
          state.messages = action.payload;
        })
        .addCase(sendMessage.fulfilled,(state,action) =>{
          state.messages.push(action.payload)
        })
    },
  });

export const {
    setInitialState,
} = messageSlice.actions;
    
  export const messagesSelector = (state: RootState) => state.messageSlice.messages;
  export default messageSlice.reducer;
  
    
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store"
import { DisplayMessage, SendMessage } from "../../components/types";
import { SetInitialMessageSliceStatePayload } from "../payloads";
import { Conversation, ConversationResponse } from "../types";

export interface MessagesConfigurationState {
    conversations: Conversation[];
    initialized: boolean;
  }
  const initialState: MessagesConfigurationState = {
    initialized: false,
    conversations: [],
  };

  export const getUserMessages = createAsyncThunk(
    "features/MessageSlice/getUserMessages",
    async(userId: number) =>{
      try{
        const response = await axios.get<ConversationResponse[]>("http://localhost:7071/api/messages/".concat(userId.toString()));
        var conversations: Conversation[] = [];
        response.data.forEach((conv) =>{
          conversations.push({recipient:{
            first_name: conv.recipient.firstName,
            last_name: conv.recipient.lastName,
            id: conv.recipient.id
          },messages:conv.messages.map((x) => {return {id: x.id,date:x.date,
            sender:{id:x.sender.id,first_name:x.sender.firstName,last_name:x.sender.lastName},
          receiver:{id:x.receiver.id,first_name:x.receiver.firstName,last_name:x.receiver.lastName},text:x.text}})})
        })
        return conversations;
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
        state.conversations = action.payload.conversations;
        state.initialized = true;
      }
    },
    extraReducers: builder => {
      builder
        .addCase(getUserMessages.fulfilled, (state, action) => {
          state.conversations = action.payload;
        })
        .addCase(sendMessage.fulfilled,(state,action) =>{
          state.conversations.find(x => x.recipient.id === action.payload.receiver.id)?.messages.push(action.payload);
        })
    },
  });

export const {
    setInitialState
} = messageSlice.actions;
    
  export const conversationsSelector = (state: RootState) => state.messageSlice.conversations;
  export const currentConversationSelector = (recipientId: number) => (state: RootState) =>
    state.messageSlice.conversations.find(conv => conv.recipient.id === recipientId);
  export default messageSlice.reducer;
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store"
import { SendMessage } from "../../components/types";
import { GetUserMessagesPayload, SetInitialMessageSliceStatePayload } from "../payloads";
import { Conversation, ConversationResponse, DisplayMessageResponse } from "../types";

export interface MessagesConfigurationState {
    conversations: Conversation[];
    initialized: boolean;
    chatHubConnection: HubConnection;
}

const initialState: MessagesConfigurationState = {
    initialized: false,
    conversations: [],
    chatHubConnection: new HubConnectionBuilder()
                      .withUrl('https://localhost:5001/hubs/chat')
                      .withAutomaticReconnect()
                      .build()
};

  export const getUserMessages = createAsyncThunk(
    "features/MessageSlice/getUserMessages",
    async(props: GetUserMessagesPayload) =>{
      try{
        const response = await axios.get<ConversationResponse[]>("http://localhost:5000/messages/userId=".concat(props.userId.toString()).concat("&connectionId=").concat(props.connectionId));
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
           const response = await axios.post<DisplayMessageResponse>("http://localhost:5000/messages",{
           senderId: props.senderId,
           receiverId: props.receiverId,
           text: props.text
          })
          var responseData = response.data;
        return {
          id: responseData.id,
          sender: { id: responseData.sender.id, last_name: responseData.sender.lastName, first_name: responseData.sender.firstName},
          receiver: { id: responseData.receiver.id, last_name: responseData.receiver.lastName, first_name: responseData.receiver.firstName},
          text: responseData.text,
          date: responseData.date
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
      },
      addMessageToConversation: (state, action:PayloadAction<DisplayMessageResponse>) =>{
        var message = action.payload;
        state.conversations.forEach((x) => {
          if(x.recipient.id === action.payload.sender.id && x.messages.some((msg) => msg.id === message.id) === false)
            x.messages.push({id: message.id,date: message.date, text: message.text,
            sender:{id: message.sender.id, first_name: message.sender.firstName, last_name: message.sender.lastName},
          receiver:{id: message.receiver.id, first_name: message.receiver.firstName, last_name: action.payload.receiver.lastName}})
        })
      },
      setMessageSliceInitialized:(state, action: PayloadAction<boolean>) =>{
          state.initialized = action.payload;
      }
    },
    extraReducers: builder => {
      builder
        .addCase(getUserMessages.fulfilled, (state, action) => {
          state.conversations = action.payload;
          state.initialized = true;
        })
        .addCase(sendMessage.fulfilled,(state,action) =>{
          state.conversations.find(x => x.recipient.id === action.payload.receiver.id)?.messages.push(action.payload);
        })
    },
  });

export const {
  setInitialState,
  addMessageToConversation,
  setMessageSliceInitialized
} = messageSlice.actions;
    
export const conversationsSelector = (state: RootState) => state.messageSlice.conversations;
export const currentConversationSelector = (recipientId: number) => (state: RootState) =>
    state.messageSlice.conversations.find(conv => conv.recipient.id === recipientId);
export const chatHubConnection = (state: RootState) => state.messageSlice.chatHubConnection;
export const isMessageSliceInitialized = (state:RootState) => state.messageSlice.initialized;

export default messageSlice.reducer;
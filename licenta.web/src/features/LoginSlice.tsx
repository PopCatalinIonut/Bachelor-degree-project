import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";

import axios from "axios";
import { RootState } from "../app/store";
import { SetInitialStatePayload } from "./payloads";
import { LoggedUserDetails, LoginCredentials } from "./types";

export interface ConfigurationState {
    user: LoggedUserDetails | null;
    initialized: boolean;
}

export const userLogin = createAsyncThunk(
  "features/LoginSlice/userLogin",
  async (credentials: LoginCredentials) => {

    const response = await axios.get<LoggedUserDetails>("http://localhost:7071/api/users/login" 
    + "&username=" + credentials.username + "&password=" + credentials.password);
    var user = {
      username: response.data.username,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email
    };
    return user;
  },
);
const initialState: ConfigurationState = {
    initialized: false,
    user: null
};

export const loginSlice = createSlice({
    name: "loginSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<SetInitialStatePayload>) => {
        state.user = action.payload.user;
        state.initialized = true;
      },
    },
    extraReducers: builder => {
      builder
        .addCase(userLogin.fulfilled, (state, action) => {
          state.user = {
            username: action.payload.username,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email
          }
        });
    },
  });

export const {
  setInitialState,
} = loginSlice.actions;
  
export const userSelector = (state: RootState) => state.loginSlice.user;
export default loginSlice.reducer;
  
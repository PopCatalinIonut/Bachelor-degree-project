import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { SetInitialLoginSliceStatePayload } from "./payloads";
import { LoggedUserDetails, LoginCredentials, SignupCredentials } from "./types";

export interface LoginSiceConfigurationState {
    user: LoggedUserDetails;
    initialized: boolean;
}
export const userSignUp = createAsyncThunk(
  "features/LoginSlice/userSignin",
  async (credentials: SignupCredentials, { rejectWithValue }) => {
  try{
      await axios.post("http://localhost:7071/api/users",{
        loginusername: credentials.username,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password
      })
      return "";
      }
      catch (err: any) {
        return rejectWithValue(err.response.data);
    }
  },
);
export const userLogin = createAsyncThunk(
  "features/LoginSlice/userLogin",
  async (credentials: LoginCredentials) => {

    const response = await axios.get<LoggedUserDetails>("http://localhost:7071/api/users/login" 
    .concat("&username=").concat(credentials.username).concat("&password=").concat(credentials.password));
    var user = {
      username: response.data.username,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email,
      id: response.data.id
    };
    return user;
  },
);
const initialState: LoginSiceConfigurationState = {
    initialized: false,
    user: {id: 0, username: "", firstName: "", lastName: "", email: "" }
};

export const loginSlice = createSlice({
    name: "loginSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<SetInitialLoginSliceStatePayload>) => {
        state.user = action.payload.user;
        state.initialized = true;
      },
      logout: (state, action: PayloadAction<{}>) => {
        state.user = { id: 0, username: "", firstName: "", lastName: "", email: ""};
        state.initialized = false;
      },
    },
    extraReducers: builder => {
      builder
        .addCase(userLogin.fulfilled, (state, action) => {
          state.user = {
            username: action.payload.username,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email,
            id: action.payload.id
          }
        });
    },
  });

export const {
  setInitialState,
  logout,
} = loginSlice.actions;
  
export const userSelector = (state: RootState) => state.loginSlice.user;
export default loginSlice.reducer;
  
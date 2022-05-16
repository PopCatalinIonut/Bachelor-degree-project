import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { Post } from "../../components/types";
import { SetInitialUserSliceStatePayload } from "./payloads";
import { LoggedUserDetails, LoginCredentials, SignupCredentials } from "./types";

export interface LoginSiceConfigurationState {
    user: LoggedUserDetails;
    initialized: boolean;
}
export const userSignUp = createAsyncThunk(
  "features/UserSlice/userSignin",
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
  "features/UserSlice/userLogin",
  async (credentials: LoginCredentials) => {

    const response = await axios.get<LoggedUserDetails>("http://localhost:7071/api/users/login" 
    .concat("&username=").concat(credentials.username).concat("&password=").concat(credentials.password));
    var user = {
      loginUsername: response.data.loginUsername,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      email: response.data.email, 
      id: response.data.id,
      postedPosts: response.data.postedPosts,
      wishlist: response.data.wishlist
    };
    return user;
  },
);
const initialState: LoginSiceConfigurationState = {
    initialized: false,
    user: {id: 0, loginUsername: "", firstName: "", lastName: "", email: "" , postedPosts :[], wishlist: []}
};

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
      setInitialState: (state, action: PayloadAction<SetInitialUserSliceStatePayload>) => {
        state.user = action.payload.user;
        state.initialized = true;
      },
      logout: (state) => {
        state.user = { id: 0, loginUsername: "", firstName: "", lastName: "", email: "", postedPosts: [], wishlist: []};
        state.initialized = false;
      },
      initUserWishlist: (state, action: PayloadAction<Post[]>) => {
        state.user.wishlist = action.payload;
        console.log(action.payload)
      },
      addItemToUserWishlist: (state, action:PayloadAction<Post>) =>{
        state.user.wishlist.push(action.payload);
      },
      removeItemFromUserWishlist: (state, action:PayloadAction<Post>) =>{
        state.user.wishlist.splice(state.user.wishlist.findIndex(x => x.id === action.payload.id),1);
      }
    },
    extraReducers: builder => {
      builder
        .addCase(userLogin.fulfilled, (state, action) => {
          state.user = {
            loginUsername: action.payload.loginUsername,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            email: action.payload.email,
            id: action.payload.id,
            postedPosts: action.payload.postedPosts,
            wishlist: action.payload.wishlist
          }
        });
    },
  });

export const {
  setInitialState,
  logout,
  initUserWishlist,
  addItemToUserWishlist,
  removeItemFromUserWishlist
} = userSlice.actions;
  
export const userSelector = (state: RootState) => state.userSlice.user;
export const userWishlistSelector = (state: RootState) =>state.userSlice.user.wishlist
export default userSlice.reducer;
  
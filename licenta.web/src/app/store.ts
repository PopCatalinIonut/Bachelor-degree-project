import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userSlice from '../features/UserSlice/UserSlice'
import marketplaceSlice from '../features/MarketplaceSlice/MarketplaceSlice';
const store = configureStore({
  reducer: {
    userSlice: userSlice,
    marketplaceSlice: marketplaceSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;

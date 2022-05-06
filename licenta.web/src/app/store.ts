import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginSlice from '../features/LoginSlice/LoginSlice'
import marketplaceSlice from '../features/MarketplaceSlice/MarketplaceSlice';
const store = configureStore({
  reducer: {
    loginSlice: loginSlice,
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

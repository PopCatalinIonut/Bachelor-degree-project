import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userSlice from '../features/UserSlice'
import marketplaceSlice from '../features/MarketplaceSlice';
import messageSlice from '../features/MessageSlice';
import outfitSlice from '../features/OutfitSlice';

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    marketplaceSlice: marketplaceSlice,
    messageSlice: messageSlice,
    outfitSlice: outfitSlice
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

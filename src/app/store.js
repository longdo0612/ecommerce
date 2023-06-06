import { configureStore } from '@reduxjs/toolkit';
import cartSlice from '../state';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
});

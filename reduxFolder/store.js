import { configureStore } from '@reduxjs/toolkit';
import shopIdReducer from './ShopIdSlice';
import UsersSlice from './UsersSlice';

const store = configureStore({
  reducer: {
    shopId: shopIdReducer,
    users: UsersSlice,
  },
});

export default store;

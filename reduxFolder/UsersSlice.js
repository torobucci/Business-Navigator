import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userAuthenticated: false,
  userName:''
};

const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserAuthenticated(state, action) {
      state.userAuthenticated = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
  },
});

export const { setUserAuthenticated, setUserName } = UsersSlice.actions;

export default UsersSlice.reducer;

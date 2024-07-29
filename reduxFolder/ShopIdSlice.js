import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shopId: '',
  shops: []
};

const shopIdSlice = createSlice({
  name: 'shopId',
  initialState,
  reducers: {
    setShopId(state, action) {
      state.shopId = action.payload;
    },
    setShops(state, action) {
      state.shops = action.payload;
    }
  },
});

export const { setShopId, setShops } = shopIdSlice.actions;

// Thunk function to fetch shops
export const fetchShops = (userId, database, onValue, ref) => (dispatch,getState) => {
  const shopsRef = ref(database, `users/${userId}/shops`);
  onValue(shopsRef, (snapshot) => {
    const allShops = [];
    snapshot.forEach((shopSnapshot) => {
      allShops.push({ id: shopSnapshot.key, ...shopSnapshot.val() });
    });

    // Dispatch the action with the fetched shopId
    dispatch(setShops(allShops));
    const { shopId } = getState().shopId;

    // Set shopId if it's not already set
    if (allShops.length > 0 && shopId.length === 0) {
      dispatch(setShopId(allShops[0].id));
    }
  });
};

export default shopIdSlice.reducer;

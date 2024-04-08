import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // カートに追加したアイテム。
      const item = action.payload;

      return updateCart(state, item);
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;

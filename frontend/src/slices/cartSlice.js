import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // カートに追加したアイテム。
      const item = action.payload;

      // カート内に、同じidを持つアイテムが既に存在するかどうかを確認する。
      const existItem = state.cartItems.find((x) => x.id === item.id);

      if (existItem) {
        // カート内に同じアイテムが既に存在する場合、そのアイテムの数量を更新する。
        state.cartItems = state.cartItems.map((x) =>
          x.id === existItem.id ? item : x
        );
      } else {
        // カート内に同じアイテムが存在しない場合は、新しいアイテムとしてカートに追加する。
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      // 該当IDのアイテムを削除する。
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);

      // updateCart関数を実行して、更新されたstateを返す。
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      state.paymentMethod = "PayPal";
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, clearCartItems } = cartSlice.actions;

export default cartSlice.reducer;

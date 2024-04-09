export const updateCart = (state) => {
  // カート内の全てのアイテムの価格を合計して、state.itemsPriceに代入する。
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 税金の計算(消費税10％)。小数は切り捨てる。
  state.taxPrice = Math.floor(0.1 * state.itemsPrice);

  // 合計価格の計算。（商品価格 + 税金）
  state.totalPrice = Number(state.itemsPrice) + Number(state.taxPrice);

  // ローカルストレージへの保存。
  localStorage.setItem("cart", JSON.stringify(state));

  //更新されたstateを、returnする。
  return state;
};

export const updateCart = (state, item) => {
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

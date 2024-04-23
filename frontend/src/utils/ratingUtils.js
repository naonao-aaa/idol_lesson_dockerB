// レビューの平均評価を計算する関数
export const calculateAverageRating = (reviews) => {
  if (reviews.length === 0) return 0; // レビューがない場合は0を返す
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / reviews.length;
};

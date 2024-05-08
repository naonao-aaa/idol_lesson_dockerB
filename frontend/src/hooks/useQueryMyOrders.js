import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//自分の注文一覧を取得するための非同期関数を定義する。
const fetchMyOrders = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/my/orders`,
    {
      withCredentials: true,
      withXSRFToken: true,
    }
  );
  return data.orders;
};

export const useQueryMyOrders = () => {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrders,
    cacheTime: 60000, //キャッシュされたデータが有効である時間をミリ秒単位で指定します。この期間内に再度同じクエリが発生した場合は、キャッシュが使用されます。
    staleTime: 60000, //キャッシュのデータが「新鮮でない」（stale）と見なされるまでの時間をミリ秒単位で指定します。
  });
};

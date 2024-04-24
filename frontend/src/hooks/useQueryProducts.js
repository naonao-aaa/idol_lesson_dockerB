import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//Productデータを取得するための非同期関数を定義する。
const getProducts = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/products`
  );
  return data;
};

export const useQueryProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    cacheTime: 60000, //キャッシュされたデータが有効である時間をミリ秒単位で指定します。この期間内に再度同じクエリが発生した場合は、キャッシュが使用されます。
    staleTime: 60000, //キャッシュのデータが「新鮮でない」（stale）と見なされるまでの時間をミリ秒単位で指定します。
  });
};

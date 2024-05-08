import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//PaypalClientIdを取得するための非同期関数を定義する。
const fetchPaypalClientId = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/config/paypal`,
    {
      withCredentials: true,
      withXSRFToken: true,
    }
  );
  return data.paypalClientId;
};

export const useQueryPaypalClientId = () => {
  return useQuery({
    queryKey: ["paypalClientId"],
    queryFn: fetchPaypalClientId,
    cacheTime: Infinity, // キャッシュされたデータが永続的に有効
    staleTime: 24 * 60 * 60 * 1000, // 1日間データを新鮮と見なす
  });
};

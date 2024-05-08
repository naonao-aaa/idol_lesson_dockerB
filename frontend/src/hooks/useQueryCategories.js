import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//カテゴリ一覧を取得するための非同期関数を定義する。
const getCategories = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/categories`
  );
  return data;
};

export const useQueryCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    cacheTime: 24 * 60 * 60 * 1000, //24時間
    staleTime: 24 * 60 * 60 * 1000, //24時間
  });
};

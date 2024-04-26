import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//個別ユーザーを取得するための非同期関数を定義する。
const getUserDetail = async (userId) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/admin/users/${userId}`,
    {
      withCredentials: true,
      withXSRFToken: true,
    }
  );
  return data.user;
};

export const useQueryAdminUserDetail = (userId) => {
  return useQuery({
    queryKey: ["userDetailAdmin", userId],
    queryFn: () => getUserDetail(userId),
    cacheTime: 60000, //キャッシュされたデータが有効である時間をミリ秒単位で指定します。この期間内に再度同じクエリが発生した場合は、キャッシュが使用されます。
    staleTime: 60000, //キャッシュのデータが「新鮮でない」（stale）と見なされるまでの時間をミリ秒単位で指定します。
  });
};

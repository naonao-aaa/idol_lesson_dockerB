import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//(管理者)全てのユーザーを取得するための非同期関数を定義する。
const fetchAllUsers = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/admin/users`,
    {
      withCredentials: true,
      withXSRFToken: true,
    }
  );
  return data.users;
};

export const useQueryAdminUsers = () => {
  return useQuery({
    queryKey: ["allUsersAdmin"],
    queryFn: fetchAllUsers,
    cacheTime: 24 * 60 * 60 * 1000, //24時間
    staleTime: 24 * 60 * 60 * 1000, //24時間
  });
};

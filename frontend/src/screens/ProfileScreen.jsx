import axios from "axios";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ProfileScreen = () => {
  const fetchMyOrder = () => {
    axios
      .get(`${BASE_URL}/api/my/orders`, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return <div>Profile画面</div>;
};

export default ProfileScreen;

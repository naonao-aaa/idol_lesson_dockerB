import axios from "axios";
import { BASE_URL } from "../../constants";
import { toast } from "react-toastify";
import { useEffect } from "react";

const OrderListScreen = () => {
  const fetchOrdersData = () => {
    axios
      .get(`${BASE_URL}/api/admin/orders`, {
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
    fetchOrdersData();
  }, []);

  return <div>OrderList画面</div>;
};

export default OrderListScreen;

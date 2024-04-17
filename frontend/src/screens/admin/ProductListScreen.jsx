import axios from "axios";
import { BASE_URL } from "../../constants";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ProductListScreen = () => {
  const fetchProductsData = () => {
    axios
      .get(`${BASE_URL}/api/admin/products`, {
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
    fetchProductsData();
  }, []);

  return <div>ProductList画面</div>;
};

export default ProductListScreen;

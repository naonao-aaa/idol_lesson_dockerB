import axios from "axios";
import { BASE_URL } from "../../constants";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery } from "../../slices/productsApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useQueryCategories } from "../../hooks/useQueryCategories";
import { useQueryProductDetail } from "../../hooks/useQueryProductDetail";
import { useQueryClient } from "@tanstack/react-query";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [contract_type, setContractType] = useState("単発契約");
  const [category_id, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useQueryProductDetail(productId);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image) {
      formData.append("image", image); // 画像がある場合のみ追加
    }
    formData.append("contract_type", contract_type);
    formData.append("category_id", category_id);
    formData.append("description", description);

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    console.log(name);

    axios
      .post(`${BASE_URL}/api/admin/products/${productId}`, formData, {
        headers: {
          "X-HTTP-Method-Override": "PUT",
        },
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("product updated successfully");
        queryClient.invalidateQueries(["allProductsAdmin"]);
        navigate("/admin/productlist");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  const handleImageChange = (e) => {
    // ユーザーが選択した最初のファイルを取得。
    const file = e.target.files[0];

    // ファイルが存在するかどうかをチェック。
    if (file) {
      // ファイルサイズをメガバイト単位で計算（1MB = 1024KB = 1024 * 1024B）。
      const fileSize = file.size / 1024 / 1024; // in MB

      // ファイルサイズが5MBを超える場合は、エラーメッセージを表示し、処理を中断。
      if (fileSize > 5) {
        toast.error("File size should not exceed 5MB");
        return;
      }

      // ファイルのMIMEタイプが画像で始まるかどうかをチェックします。(ファイルが画像ファイルであることを確認)
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // stateにセット
      setImage(file);
    }
  };

  const { status, data: allCategory } = useQueryCategories();

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || 0);
      setImage(""); // 初期値は空に設定し、ユーザーが新しい画像を選択した場合にのみ更新
      setContractType(product.contract_type || "単発契約");
      setCategoryId(product.category_id || "");
      setDescription(product.description || "");
    }
  }, [product]);

  // console.log(name);

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        戻る
      </Link>
      <FormContainer>
        <h1>Edit Plan</h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>プラン名</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="price">
              <Form.Label>価格</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="contract_type">
              <Form.Label>契約タイプ</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="単発契約"
                  value="単発契約"
                  checked={contract_type === "単発契約"}
                  required
                  onChange={(e) => setContractType(e.target.value)}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="月契約"
                  value="月契約"
                  checked={contract_type === "月契約"}
                  onChange={(e) => setContractType(e.target.value)}
                />
              </div>
            </Form.Group>
            <br />

            <Form.Group controlId="category">
              <Form.Label>カテゴリー</Form.Label>
              <Form.Control
                as="select"
                required
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">カテゴリを選択してください</option>
                {allCategory?.map((oneOfAllCategory) => (
                  <option key={oneOfAllCategory.id} value={oneOfAllCategory.id}>
                    {oneOfAllCategory.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="image">
              <Form.Label>画像</Form.Label>
              <Form.Control
                type="file"
                // required
                onChange={handleImageChange}
              ></Form.Control>
            </Form.Group>
            <br />

            <Form.Group controlId="description">
              <Form.Label>説明</Form.Label>
              <Form.Control
                as="textarea"
                rows={4} // 行数を設定
                required
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />

            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: "1rem" }}
            >
              更新
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;

import axios from "axios";
import { BASE_URL } from "../../constants";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";

const ProductCreateScreen = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [contract_type, setContractType] = useState("単発契約");
  const [category_id, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("contract_type", contract_type);
    formData.append("category_id", category_id);
    formData.append("description", description);

    axios
      .post(`${BASE_URL}/api/admin/products`, formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("product created successfully");
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

  const fetchAllCategory = async () => {
    axios
      .get(`${BASE_URL}/api/categories`)
      .then((response) => {
        setAllCategory(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
    // refetch();
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        戻る
      </Link>
      <FormContainer>
        <h1>Create Plan</h1>

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
              {allCategory.map((oneOfAllCategory) => (
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
              required
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

          <Button type="submit" variant="primary" style={{ marginTop: "1rem" }}>
            新規作成
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;

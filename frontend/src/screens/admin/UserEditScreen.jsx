import axios from "axios";
import { BASE_URL } from "../../constants";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UserEditScreen = () => {
  const [user, setUser] = useState(null);

  const { id: userId } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  const fetchUserDetail = async () => {
    axios
      .get(`${BASE_URL}/api/admin/users/${userId}`, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log({ name, email, isAdmin });

    axios
      .put(
        `${BASE_URL}/api/admin/users/${userId}`,
        { name, email, isAdmin },
        {
          withCredentials: true,
          withXSRFToken: true,
        }
      )
      .then((response) => {
        toast.success("user updated successfully");
        navigate("/admin/userlist");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  useEffect(() => {
    fetchUserDetail();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        戻る
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {!user ? (
          <Loader />
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <br />

            <Form.Group className="my-2" controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <br />

            <Button type="submit" variant="primary">
              更新
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;

import axios from "axios";
import { BASE_URL } from "../../constants";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useQueryAdminUsers } from "../../hooks/admin/useQueryAdminUsers";

const UserListScreen = () => {
  const {
    status,
    data: users,
    isLoading,
    error,
    refetch,
  } = useQueryAdminUsers();

  const deleteHandler = async (id) => {
    if (window.confirm("本当に削除しますか？")) {
      axios
        .delete(`${BASE_URL}/api/admin/users/${id}`, {
          withCredentials: true,
          withXSRFToken: true,
        })
        .then((response) => {
          console.log(response.data);
          toast.success("User deleted");
          refetch();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || error.message);
        });
    }
  };

  return (
    <>
      {error && (
        <Message variant="danger">{error.response.data.message}</Message>
      )}

      <h1>Users</h1>

      {!users ? (
        <Loader />
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <LinkContainer
                        to={`/admin/user/${user.id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(user.id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;

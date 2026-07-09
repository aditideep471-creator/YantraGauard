import api from "./axios";

/* Get all users */
export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

/* Update user */
export const updateUser = async (userId, payload) => {
  const res = await api.put(`/users/${userId}`, payload);
  return res.data;
};

/* Delete user */
export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};
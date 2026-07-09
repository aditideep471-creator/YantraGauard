import api from "./axios";

/* ================= FETCH ALL USERS ================= */
export const fetchUsers = async () => {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ================= UPDATE USER ================= */
export const updateUser = async (id, data) => {
  const token = localStorage.getItem("access_token");

  const res = await api.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ================= DELETE USER ================= */
export const deleteUser = async (id) => {
  const token = localStorage.getItem("access_token");

  const res = await api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ================= FETCH SINGLE USER ================= */
export const fetchUserById = async (id) => {
  const token = localStorage.getItem("access_token");

  const res = await api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../api/users";

function UsersPage() {

  /* ================= STATE ================= */
  const [users, setUsers] = useState([]);

  /* ================= LOAD USERS ON MOUNT ================= */
  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= FETCH USERS FROM BACKEND ================= */
  const loadUsers = async () => {
    try {
      const response = await fetchUsers();

      //  IMPORTANT FIX:
      // Backend might return:
      // 1) [ {...}, {...} ]
      // 2) { users: [ {...} ] }
      // 3) { data: [ {...} ] }
      // So we safely extract the array

      let usersArray = [];

      if (Array.isArray(response)) {
        usersArray = response;
      } else if (Array.isArray(response?.users)) {
        usersArray = response.users;
      } else if (Array.isArray(response?.data)) {
        usersArray = response.data;
      }

      setUsers(usersArray);

    } catch (error) {
      console.log("Fetch Users Error:", error);
      alert("Failed to load users");
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (userId) => {

    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(userId);

      //  Reload users after delete
      loadUsers();

    } catch (error) {
      console.log("Delete Error:", error);
      alert("Failed to delete user");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: "20px" }}>

      <h2>User Management</h2>

      {/*  If no users found */}
      {users.length === 0 && (
        <p>No users found.</p>
      )}

      {/*  Render Users */}
      {users.map((u) => {

        //  IMPORTANT FIX:
        // Some backends use "id"
        // MongoDB uses "_id"
        const userId = u.id || u._id;

        return (
          <div
            key={userId}
            style={{
              marginBottom: "15px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}
          >
            <p>
              <strong>Name:</strong> {u.name}
            </p>

            <p>
              <strong>Email:</strong> {u.email}
            </p>

            <p>
              <strong>Role:</strong> {u.role}
            </p>

            <button
              onClick={() => handleDelete(userId)}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>

          </div>
        );
      })}

    </div>
  );
}

export default UsersPage;
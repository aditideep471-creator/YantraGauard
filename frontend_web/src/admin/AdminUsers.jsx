import { useEffect, useState } from "react";
import { fetchUsers, updateUser, deleteUser } from "../api/admin";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./AdminUsers.module.css";

const ROLES = ["technician", "employee", "medical_staff", "admin", "manager"];

const DEPARTMENTS = [
  "Fire and Safety",
  "Mechanical",
  "Electrical",
  "Medical",
];

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  /* ================= UPDATE USER ================= */

  const handleUpdate = async (userId, role, department) => {

    try {

      setUpdatingId(userId);

      await updateUser(userId, { role, department });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role, department }
            : u
        )
      );

    } catch (err) {

      console.error(err);
      setError("Failed to update user");

    } finally {

      setUpdatingId(null);

    }

  };

  /* ================= DELETE USER ================= */

  const handleDelete = async (userId) => {

    const ok = window.confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {

      await deleteUser(userId);

      setUsers((prev) =>
        prev.filter((u) => u.id !== userId)
      );

    } catch (err) {

      console.error(err);
      setError("Failed to delete user");

    }

  };

  /* ================= LOAD USERS ================= */

  useEffect(() => {

    const loadUsers = async () => {

      try {

        const data = await fetchUsers();
        setUsers(data);

      } catch (err) {

        console.error(err);
        setError("Failed to load users");

      } finally {

        setLoading(false);

      }

    };

    loadUsers();

  }, []);

  if (loading) return <p className={styles.state}>Loading users…</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (

    <Page title="Admin – User Management">

      <Card>

        {users.length === 0 ? (

          <p className={styles.state}>No users found.</p>

        ) : (

          <table className={styles.table}>

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {users.map((u) => {

                const userId = u.id;

                return (

                  <tr key={userId}>

                    <td>{u.name}</td>

                    <td className={styles.muted}>{u.email}</td>

                    {/* ROLE */}
                    <td>

                      <select
                        className={styles.select}
                        value={u.role || ""}
                        disabled={
                          updatingId === userId ||
                          u.role === "admin" ||
                          u.role === "manager"
                        }
                        onChange={(e) =>
                          handleUpdate(
                            userId,
                            e.target.value,
                            u.department
                          )
                        }
                      >

                        {ROLES.map((r) => (

                          <option key={r} value={r}>
                            {r}
                          </option>

                        ))}

                      </select>

                    </td>

                    {/* DEPARTMENT */}

                    <td>

                      <select
                        className={styles.select}
                        value={u.department || ""}
                        disabled={
                          updatingId === userId ||
                          u.role === "admin" ||
                          u.role === "manager"
                        }
                        onChange={(e) =>
                          handleUpdate(
                            userId,
                            u.role,
                            e.target.value
                          )
                        }
                      >

                        <option value="">—</option>

                        {DEPARTMENTS.map((d) => (

                          <option key={d} value={d}>
                            {d}
                          </option>

                        ))}

                      </select>

                    </td>

                    {/* DELETE */}

                    <td>

                      <button
                        className={styles.delete}
                        disabled={u.role === "admin" || u.role === "manager"}
                        onClick={() => handleDelete(userId)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        )}

      </Card>

    </Page>

  );

}

export default AdminUsers;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./Register.module.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "employee",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Input Change
  const handleChange = (e) => {
    // If role changes → reset department
    if (e.target.name === "role") {
      setForm({
        ...form,
        role: e.target.value,
        department: "",
      });
      return;
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Page>
      <div className={styles.wrapper}>
        <Card>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>
            Join YantraGuard and help keep the workplace safe
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* NAME */}
            <input
              className={styles.input}
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}
            <input
              className={styles.input}
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* PASSWORD */}
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* ROLE */}
            <select
              className={styles.input}
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="technician">Technician</option>
              <option value="medical_staff">Medical Staff</option>
              
            </select>

            {/*  DEPARTMENT (Hidden if Employee) */}
            {form.role !== "employee" && (
              <select
                className={styles.input}
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                <option value="Fire and Safety">Fire and Safety</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Medical">Medical</option>
              </select>
            )}

            {/* ERROR */}
            {error && <p className={styles.error}>{error}</p>}

            {/* BUTTON */}
            <button className={styles.button} type="submit">
              Create account
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
}

export default Register;
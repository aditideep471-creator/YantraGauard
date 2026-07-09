import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import NotificationBell from "./NotificationBell";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <span className={styles.logo}>YantraGuard</span>
      </div>

    <div className={styles.center}>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/incidents/upload">Report Incident</Link>

  {(user.role === "technician" || user.role === "manager" || user.role == "employee") && (
    <Link to="/incidents">Incidents</Link>
  )}

  {user.role === "admin" && (
    <>
      <Link to="/incidents">All Incidents</Link>
      <Link to="/admin/users">Manage Users</Link>
    </>
  )}
</div>

      <div className={styles.right}>

  <NotificationBell />

  <span className={styles.user}>
    {user.name} <em>({user.role})</em>
  </span>

  <LogoutButton />

</div>
    </nav>
  );
}

export default Navbar;

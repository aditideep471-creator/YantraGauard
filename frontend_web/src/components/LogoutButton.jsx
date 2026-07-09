import { useNavigate } from "react-router-dom";
import styles from "./LogoutButton.module.css";

function LogoutButton() {
  const navigate = useNavigate();

  return (
    <button
      className={styles.logoutBtn}
      onClick={() => navigate("/logout")}
    >
      Logout
    </button>
  );
}

export default LogoutButton;
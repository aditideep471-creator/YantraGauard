import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Page from "../components/Page";
import Card from "../components/Card";
import styles from "./DashboardRedirect.module.css";

function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  let redirectPath = "/dashboard/employee";

  /* normalize role to avoid casing / formatting issues */
  const role = user.role?.toLowerCase().replace(" ", "_");

  switch (role) {
    case "admin":
      redirectPath = "/dashboard/admin";
      break;

    case "manager":
      redirectPath = "/dashboard/manager";
      break;

    case "technician":
      redirectPath = "/dashboard/technician";
      break;

    /* ✅ Added medical_staff support */
    case "medical_staff":
      redirectPath = "/dashboard/medical";
      break;

    default:
      redirectPath = "/dashboard/employee";
  }

  return (
    <Page>
      <div className={styles.wrapper}>
        <Card>
          <h2 className={styles.title}>Preparing your dashboard</h2>
          <p className={styles.subtitle}>
            Redirecting you based on your role…
          </p>

          <div className={styles.loader} />

          {/* actual redirect */}
          <Navigate to={redirectPath} />
        </Card>
      </div>
    </Page>
  );
}

export default DashboardRedirect;
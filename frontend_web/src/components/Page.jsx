import styles from "./Page.module.css";

export default function Page({ title, children }) {
  return (
    <div className={styles.page}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </div>
  );
}

import styles from "./Card.module.css";

export default function Card({
  children,
  onClick,
  className = "",
}) {
  return (
    <div
      className={`${styles.card} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </div>
  );
}
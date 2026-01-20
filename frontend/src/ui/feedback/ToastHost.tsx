import { Toast } from "../../contexts/ToastContext";
import styles from "./toastHost.module.css";

export default function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className={styles.host} role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`} role="status">
          <div className={styles.titleRow}>
            <div className={styles.title}>{t.title}</div>
            <button className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Fermer">
              x
            </button>
          </div>
          {t.message ? <div className={styles.message}>{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}

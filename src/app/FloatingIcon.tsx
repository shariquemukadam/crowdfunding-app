import styles from './FloatingIcon.module.css';

export default function FloatingIcon() {
  return (
    <div className={styles.floatingIcon}>
      <img src="/lightning-bolt.png" alt="Toggle Feature" />
    </div>
  );
}
import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';

export const metadata = {
  title: 'Contact - FundRaiser',
  description: 'Get in touch with FundRaiser',
};

export default function Contact() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>Contact Us</h1>
        <p>Reach out to us for support or inquiries.</p>
      </main>
      <FloatingIcon />
    </div>
  );
}
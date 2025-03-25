import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';

export const metadata = {
  title: 'About - FundRaiser',
  description: 'Learn more about FundRaiser',
};

export default function About() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>About Us</h1>
        <p>Learn more about our mission to support education through crowdfunding.</p>
      </main>
      <FloatingIcon />
    </div>
  );
}
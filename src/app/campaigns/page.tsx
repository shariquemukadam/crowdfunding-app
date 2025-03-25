import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';

export const metadata = {
  title: 'Campaigns - FundRaiser',
  description: 'Explore campaigns on FundRaiser',
};

export default function Campaigns() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>Campaigns Page</h1>
        <p>List of campaigns will go here.</p>
      </main>
      <FloatingIcon />
    </div>
  );
}
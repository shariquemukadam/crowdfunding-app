import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';
import LendContent from './LendContent';

export const metadata = {
  title: 'Lend - FundRaiser',
  description: 'Lend money to support education',
};

export default function Lend() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>Lend to Students</h1>
        <p>Browse student fundraisers and choose one to lend to. You’ll get your money back with the interest rate specified by the student.</p>
        <LendContent />
      </main>
      <FloatingIcon />
    </div>
  );
}
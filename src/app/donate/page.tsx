import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import styles from '../styles/Page.module.css';

export const metadata = {
  title: 'Donate - FundRaiser',
  description: 'Make a donation to support education',
};

export default function Donate() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <h1>Donate</h1>
        <p>Fill out the form below to make a donation.</p>
        <form className={styles.form}>
          <label>
            Amount:
            <input type="number" placeholder="Enter amount" />
          </label>
          <label>
            Name:
            <input type="text" placeholder="Your name" />
          </label>
          <button type="submit">Submit Donation</button>
        </form>
      </main>
      <FloatingIcon />
    </div>
  );
}
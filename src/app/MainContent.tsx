import Link from 'next/link';
import Image from 'next/image'; // Import Image component
import styles from './MainContent.module.css';

export default function MainContent() {
  return (
    <main className={styles.mainContent}>
      <div className={styles.textSection}>
        <h1>
          Make a difference today<br />with your support
        </h1>
        <p>
          Join thousands of supporters who are changing lives through our platform. Every contribution counts, whether you donate or lend.
        </p>
        <div className={styles.buttons}>
          <Link href="/donate" className={styles.donateButton}>
            Donate Now
          </Link>
          <Link href="/lend" className={styles.lendButton}>
            Lend Now
          </Link>
        </div>
      </div>
      <div className={styles.imageSection}>
        {/* Replace <img> with <Image> */}
        <Image 
          src="/hero-image.jpg" 
          alt="Teamwork and support" 
          width={800} 
          height={600} 
        />
      </div>
    </main>
  );
}

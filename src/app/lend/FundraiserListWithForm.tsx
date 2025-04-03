"use client";

import { useLend } from './LendContext';
import styles from '../styles/Page.module.css'; // Keep styles import
import LendForm from './LendForm';

export default function FundraiserListWithForm() {
  const { fundraisers } = useLend();

  return (
    <div className={styles.container}> {/* Apply styles */}
      {fundraisers.length === 0 ? (
        <p>No fundraisers available at the moment.</p>
      ) : (
        fundraisers.map((fundraiser) => (
          <div key={fundraiser.id} className={styles.fundraiserCard}> {/* Apply styles */}
            <h2>{fundraiser.student_name}</h2>
            <p>Amount Requested: ${fundraiser.amount_requested}</p>
            <p>Interest Rate: {fundraiser.interest_rate}% per year</p>
            <LendForm
              studentName={fundraiser.student_name}
              interestRate={fundraiser.interest_rate}
              amountRequested={fundraiser.amount_requested}
              fundraiserId={fundraiser.id}
            />
          </div>
        ))
      )}
    </div>
  );
}

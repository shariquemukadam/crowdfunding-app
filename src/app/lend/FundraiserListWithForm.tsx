"use client";

import { useLend } from './LendContext';
import styles from '../styles/Page.module.css';
import LendForm from './LendForm';

export default function FundraiserListWithForm() {
  const { fundraisers } = useLend();

  return (
    <div style={{ marginTop: '2rem' }}>
      {fundraisers.length === 0 ? (
        <p>No fundraisers available at the moment.</p>
      ) : (
        fundraisers.map((fundraiser) => (
          <div
            key={fundraiser.id}
            style={{
              backgroundColor: '#f0f8ff',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#000080' }}>
              {fundraiser.student_name}
            </h2>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              Amount Requested: ${fundraiser.amount_requested}
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              Interest Rate: {fundraiser.interest_rate}% per year
            </p>
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
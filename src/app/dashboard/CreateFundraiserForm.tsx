"use client";

import { useState } from 'react';
import { useLend } from '../lend/LendContext';
import styles from '../styles/Page.module.css';

export default function CreateFundraiserForm() {
  const { addFundraiser } = useLend();
  const [student_name, setStudentName] = useState('');
  const [amountRequested, setAmountRequested] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fundraiserData: Omit<
        {
          id: number;
          student_id: string;
          student_name: string;
          amount_requested: number;
          interest_rate: number;
          goal_amount: number;
          status: string;
          created_at: string;
        },
        'id' | 'student_id' | 'created_at' | 'status'
      > = {
        student_name,
        amount_requested: parseInt(amountRequested),
        interest_rate: parseInt(interestRate),
        goal_amount: parseInt(goalAmount),
      };
      await addFundraiser(fundraiserData);
      alert('Fundraiser created successfully!');
      setStudentName('');
      setAmountRequested('');
      setInterestRate('');
      setGoalAmount('');
    } catch (error) {
      alert('Error creating fundraiser: ' + (error as Error).message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Your Name:
        <input
          type="text"
          value={student_name}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </label>
      <label>
        Goal Amount:
        <input
          type="number"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
          placeholder="Enter goal amount"
          required
          min="1"
        />
      </label>
      <label>
        Amount Requested (Initial Request):
        <input
          type="number"
          value={amountRequested}
          onChange={(e) => setAmountRequested(e.target.value)}
          placeholder="Enter amount"
          required
          min="1"
        />
      </label>
      <label>
        Interest Rate (% per year):
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          placeholder="Enter interest rate (e.g., 0, 3, 5, 10)"
          required
          min="0"
          step="0.1"
        />
      </label>
      <button type="submit">Create Fundraiser</button>
    </form>
  );
}
"use client";

import { useState } from 'react';
import styles from '../styles/Page.module.css';
import { supabase } from '../lib/supabaseClient';
type LendFormProps = {
  studentName: string;
  interestRate: number;
  amountRequested: number;
  fundraiserId: number;
};

export default function LendForm({ studentName, interestRate, amountRequested, fundraiserId }: LendFormProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to lend.');
      return;
    }

    const { error } = await supabase
      .from('lending_transactions')
      .insert({
        fundraiser_id: fundraiserId,
        investor_id: user.id,
        amount_lent: parseInt(amount),
      });

    if (error) {
      alert('Error lending: ' + error.message);
    } else {
      alert(`You have lent $${amount} to ${studentName} at ${interestRate}% interest!`);
      setAmount('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Amount to Lend:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          min="1"
          max={amountRequested.toString()}
        />
      </label>
      <button type="submit">Lend Now</button>
    </form>
  );
}
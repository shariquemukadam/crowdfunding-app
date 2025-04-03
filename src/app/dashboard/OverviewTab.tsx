"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLend } from "../lend/LendContext";

type LendingTransaction = {
  id: number;
  fundraiser_id: number;
  investor_id: string;
  amount_lent: number;
  created_at: string;
};

export default function OverviewTab() {
  const { fundraisers } = useLend();
  const [userId, setUserId] = useState<string | null>(null);
  const [lendingTransactions, setLendingTransactions] = useState<LendingTransaction[]>([]);

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, []);

  // Fetch lending transactions
  useEffect(() => {
    const fetchLendingTransactions = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from("lending_transactions")
        .select("*")
        .in(
          "fundraiser_id",
          fundraisers.filter((f) => f.student_id === userId).map((f) => f.id)
        )
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching lending transactions:", error);
      } else {
        setLendingTransactions(data || []);
      }
    };
    fetchLendingTransactions();
  }, [userId, fundraisers]);

  if (!userId) return <p>Loading...</p>;

  const userFundraisers = fundraisers.filter((f) => f.student_id === userId);

  return (
    <div>
      <h1>Overview Tab</h1>

      {/* Display User Fundraisers */}
      <section>
        <h2>Your Fundraisers</h2>
        {userFundraisers.length === 0 ? (
          <p>You have no active fundraisers.</p>
        ) : (
          userFundraisers.map((fundraiser) => (
            <div key={fundraiser.id}>
              <h3>{fundraiser.student_name}</h3>
              <p>Amount Requested: ${fundraiser.amount_requested}</p>
            </div>
          ))
        )}
      </section>

      {/* Display Lending Transactions */}
      <section>
        <h2>Your Lending Transactions</h2>
        {lendingTransactions.length === 0 ? (
          <p>You have no lending transactions.</p>
        ) : (
          lendingTransactions.map((transaction) => (
            <div key={transaction.id}>
              <p>Amount Lent: ${transaction.amount_lent}</p>
              <p>Date: {new Date(transaction.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

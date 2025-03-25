"use client";

import { LendProvider } from './LendContext';
import FundraiserListWithForm from './FundraiserListWithForm';

export default function LendContent() {
  return (
    <LendProvider>
      <FundraiserListWithForm />
    </LendProvider>
  );
}
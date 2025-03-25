"use client";

import { LendProvider } from '../lend/LendContext';
import CreateFundraiserForm from './CreateFundraiserForm';

export default function FundraiserFormWrapper() {
  return (
    <LendProvider>
      <CreateFundraiserForm />
    </LendProvider>
  );
}
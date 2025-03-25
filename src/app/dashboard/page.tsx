import Header from '../Header';
import FloatingIcon from '../FloatingIcon';
import DashboardContent from './DashboardContent';
import { LendProvider } from '../lend/LendContext'; // Import LendProvider

export const metadata = {
  title: 'Dashboard - FundRaiser',
  description: 'Manage your fundraisers',
};

export default function Dashboard() {
  return (
    <>
      <Header />
      <LendProvider>
        <DashboardContent />
      </LendProvider>
      <FloatingIcon />
    </>
  );
}
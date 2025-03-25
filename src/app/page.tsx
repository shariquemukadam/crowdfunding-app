import Header from './Header';
import MainContent from './MainContent';
import FloatingIcon from './FloatingIcon';

export const metadata = {
  title: 'Dakshina',
  description: 'Crowdfunding platform for education',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {
  return (
    <div>
      <Header />
      <MainContent />
      <FloatingIcon />
    </div>
  );
}
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-amazon-background">
      <Navbar />
      {/* We use flex-col and a relative main to ensure no overlapping */}
      <main className="relative z-10 w-full pb-10">
        <Outlet />
      </main>
      {/* Footer... */}
    </div>
  );
};

export default MainLayout;
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const location = useLocation();
  
  // Check if the current URL is exactly the checkout page
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="flex flex-col min-h-screen bg-amazon-background">
      {/* Conditionally render the Navbar: Hide it if we are on the checkout page */}
      {!isCheckout && <Navbar />}
      
      {/* We use flex-col and a relative main to ensure no overlapping */}
      <main className="relative z-10 w-full pb-10">
        <Outlet />
      </main>
      
      {/* Footer... */}
    </div>
  );
};

export default MainLayout;
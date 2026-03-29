import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // 1. IMPORT IT HERE

const MainLayout = () => {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <div className="flex flex-col min-h-screen bg-amazon-background">
      {!isCheckout && <Navbar />}
      
      {/* flex-grow pushes the footer to the bottom if the page has low content */}
      <main className="relative z-10 w-full flex-grow">
        <Outlet />
      </main>
      
      {/* 2. ADD IT HERE - Hide on Checkout just like Navbar */}
      {!isCheckout && <Footer />}
    </div>
  );
};

export default MainLayout;
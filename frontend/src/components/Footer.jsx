import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-8 text-white w-full">
      {/* 1. Back to top button */}
      <div 
        onClick={scrollToTop} 
        className="bg-[#37475A] hover:bg-[#485769] transition-colors py-4 text-center text-sm font-medium cursor-pointer"
      >
        Back to top
      </div>

      {/* 2. Main Links Section */}
      <div className="bg-[#232F3E] py-10 px-4 md:px-0 border-b border-gray-600">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-base">Get to Know Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link to="#" className="hover:underline">About Amazon</Link></li>
              <li><Link to="#" className="hover:underline">Careers</Link></li>
              <li><Link to="#" className="hover:underline">Press Releases</Link></li>
              <li><Link to="#" className="hover:underline">Amazon Science</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-base">Connect with Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link to="#" className="hover:underline">Facebook</Link></li>
              <li><Link to="#" className="hover:underline">Twitter</Link></li>
              <li><Link to="#" className="hover:underline">Instagram</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-base">Make Money with Us</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link to="#" className="hover:underline">Sell on Amazon</Link></li>
              <li><Link to="#" className="hover:underline">Sell under Amazon Accelerator</Link></li>
              <li><Link to="#" className="hover:underline">Protect and Build Your Brand</Link></li>
              <li><Link to="#" className="hover:underline">Amazon Global Selling</Link></li>
              <li><Link to="#" className="hover:underline">Supply to Amazon</Link></li>
              <li><Link to="#" className="hover:underline">Become an Affiliate</Link></li>
              <li><Link to="#" className="hover:underline">Fulfilment by Amazon</Link></li>
              <li><Link to="#" className="hover:underline">Advertise Your Products</Link></li>
              <li><Link to="#" className="hover:underline">Amazon Pay on Merchants</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-base">Let Us Help You</h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li><Link to="#" className="hover:underline">Your Account</Link></li>
              <li><Link to="#" className="hover:underline">Returns Centre</Link></li>
              <li><Link to="#" className="hover:underline">Recalls and Product Safety Alerts</Link></li>
              <li><Link to="#" className="hover:underline">100% Purchase Protection</Link></li>
              <li><Link to="#" className="hover:underline">Amazon App Download</Link></li>
              <li><Link to="#" className="hover:underline">Help</Link></li>
            </ul>
          </div>
        </div>

        {/* Logo and Selectors */}
        <div className="max-w-[1000px] mx-auto mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-20 object-contain mt-2 filter invert" />
          <div className="flex gap-2 text-sm mt-2 md:mt-0">
            <button className="border border-gray-400 px-8 py-2 rounded-sm text-gray-300 flex items-center gap-2 hover:border-white">
              🌐 English <span className="text-[10px] ml-2">▼</span>
            </button>
            <button className="border border-gray-400 px-6 py-2 rounded-sm text-gray-300 flex items-center gap-2 hover:border-white">
              🇮🇳 India
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal / Affiliate Section */}
      <div className="bg-[#131A22] py-8 px-4 text-xs text-gray-300">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 mb-8">
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">AbeBooks</p>
            <p className="text-[#999] leading-tight">Books, art<br/>& collectibles</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Amazon Web Services</p>
            <p className="text-[#999] leading-tight">Scalable Cloud<br/>Computing Services</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Audible</p>
            <p className="text-[#999] leading-tight">Download<br/>Audio Books</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">IMDb</p>
            <p className="text-[#999] leading-tight">Movies, TV<br/>& Celebrities</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Shopbop</p>
            <p className="text-[#999] leading-tight">Designer<br/>Fashion Brands</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Amazon Business</p>
            <p className="text-[#999] leading-tight">Everything For<br/>Your Business</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Prime Now</p>
            <p className="text-[#999] leading-tight">2-Hour Delivery<br/>on Everyday Items</p>
          </div>
          <div className="hover:underline cursor-pointer">
            <p className="font-bold text-white mb-0.5">Amazon Prime Music</p>
            <p className="text-[#999] leading-tight">100 million songs, ad-free<br/>Over 15 million podcast episodes</p>
          </div>
        </div>

        <div className="text-center flex flex-col items-center space-y-1">
          <div className="flex gap-4 mb-1">
            <Link to="#" className="hover:underline">Conditions of Use & Sale</Link>
            <Link to="#" className="hover:underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline">Interest-Based Ads</Link>
          </div>
          <p>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
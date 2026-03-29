import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../api/cartService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

const Navbar = () => {

    
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Fetch Categories for the dropdown
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
        const { data } = await apiClient.get('/categories');
        return data;
        }
    });

    // Handle Search Execution
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append('search', searchTerm.trim());
        if (selectedCategory && selectedCategory !== 'All') params.append('category_id', selectedCategory);
        
        navigate(`/?${params.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    
    // Fetch cart data automatically
    const { data: cartData } = useQuery({
        queryKey: ['cart'],
        queryFn: cartService.getCart,
    });

    // Amazon counts the total quantity of items, not just the unique rows.
    // We use optional chaining (?.) to safely handle the initial loading state.
    const cartItemCount = cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    return (
    <header className="sticky top-0 z-[100] w-full flex flex-col">
        {/* Top Nav - Deep Black/Blue */}
        <div className="bg-[#131921] text-white flex items-center px-4 py-1 gap-4 h-[60px]">
        {/* Logo */}
        <Link to="/" className="pt-2 border border-transparent hover:border-white p-1">
            <img src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="logo" className="w-24 object-contain" />
        </Link>

        {/* Deliver To */}
        <div className="hidden md:flex flex-col items-start border border-transparent hover:border-white p-1 cursor-pointer">
            <span className="text-[12px] text-gray-300 leading-none ml-5">Deliver to</span>
            <div className="flex items-center">
            <MapPin size={15} className="font-bold" />
            <span className="text-[14px] font-bold leading-none">India</span>
            </div>
        </div>

        {/* Search */}
        <div className="flex flex-grow h-10 rounded-md overflow-hidden bg-white focus-within:ring-[3px] focus-within:ring-[#F3A847]">
        <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#E6E6E6] text-black text-[12px] px-2 border-r border-gray-300 outline-none hover:bg-gray-300 cursor-pointer max-w-[60px] md:max-w-fit"
        >
            <option value="All">All</option>
            {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>
        
        <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow outline-none px-3 text-black" 
            placeholder="Search Amazon.in" 
        />
        
        <div 
            onClick={handleSearch}
            className="bg-[#FEBD69] p-2 w-12 flex items-center justify-center hover:bg-[#F3A847] cursor-pointer text-amazon-default transition-colors"
        >
            <Search size={22} strokeWidth={3} />
        </div>
        </div>

        {/* Right Nav Items */}
        <div className="flex items-center gap-4 px-2">
            <div className="border border-transparent hover:border-white p-1 cursor-pointer flex flex-col items-start justify-center">
                <p className="text-[12px] leading-none mb-1">Hello, Scaler</p>
                <p className="text-[14px] font-bold leading-none flex items-center gap-1">
                Account & Lists <span className="text-gray-400 text-[10px] mt-0.5">▼</span>
                </p>
            </div>
            <Link to="/orders" className="border border-transparent hover:border-white p-1 cursor-pointer flex flex-col justify-center">
                <p className="text-[12px] leading-none mb-1">Returns</p>
                <p className="text-[14px] font-bold leading-none">& Orders</p>
            </Link>
            <Link to="/cart" className="flex items-end border border-transparent hover:border-white p-1 relative">
                <ShoppingCart size={32} />
                <span className="absolute top-0 right-[32px] font-bold text-[#F3A847] text-lg">{cartItemCount}</span>
                <p className="font-bold text-[14px] mt-4 ml-1">Cart</p>
            </Link>
        </div>
        </div>

        {/* Bottom Nav - The Part that was "Grayed Out" */}
        {/* Using a hardcoded hex code here to ensure Tailwind doesn't fail */}
        <div className="bg-[#232F3E] text-white flex items-center px-4 py-1 text-[14px] gap-1 font-medium shadow-md">
        <div className="flex items-center font-bold border border-transparent hover:border-white p-2 cursor-pointer shrink-0">
            <Menu size={20} className="mr-1" /> All
        </div>
        {["Fresh", "Amazon miniTV", "Sell", "Best Sellers", "Mobiles", "Today's Deals"].map(item => (
            <span key={item} className="px-2 py-2 border border-transparent hover:border-white cursor-pointer whitespace-nowrap">
            {item}
            </span>
        ))}
        </div>
    </header>
  );
};

export default Navbar;
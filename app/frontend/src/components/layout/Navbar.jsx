import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

const Navbar = () => {
  const { cartItems, toggleCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E5E0] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-1 flex gap-8 items-center">
            <Link to="/shop" className="text-xs font-semibold tracking-widest uppercase text-brand-dark hover:text-brand-gold transition-colors">Shop All</Link>
            <div className="hidden lg:flex gap-6">
              <Link to="/shop?category=Bridal" className="text-xs tracking-widest uppercase text-brand-gray hover:text-brand-dark transition-colors">Bridal Collection</Link>
              <Link to="/shop?category=Groom" className="text-xs tracking-widest uppercase text-brand-gray hover:text-brand-dark transition-colors">Groom / Sherwani</Link>
              <Link to="/shop?category=Sangeet" className="text-xs tracking-widest uppercase text-brand-gray hover:text-brand-dark transition-colors">Sangeet & Party</Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <Link to="/" className="text-2xl font-serif tracking-tight text-brand-dark">MV JEWELERS</Link>
          </div>

          <div className="flex-1 flex justify-end gap-6 items-center">
            {localStorage.getItem('adminToken') ? (
              <div className="flex items-center gap-6">
                <Link to="/admin" className="text-[10px] bg-brand-dark text-white px-3 py-1 uppercase tracking-widest font-bold">Admin Terminal</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/';
                  }}
                  className="text-[10px] tracking-widest uppercase text-brand-gray hover:text-red-500 transition-colors">
                  Exit
                </button>
              </div>
            ) : localStorage.getItem('customerToken') ? (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="text-xs font-semibold tracking-widest uppercase text-brand-dark hover:text-brand-gold transition-colors">
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('customerToken');
                    localStorage.removeItem('customerName');
                    window.location.href = '/';
                  }}
                  className="text-[10px] tracking-widest uppercase text-brand-gray hover:text-red-500 transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="text-xs font-semibold tracking-widest uppercase text-brand-gray hover:text-brand-dark transition-colors">Sign In</Link>
            )}
            
            <button onClick={toggleCart} className="text-xs font-semibold tracking-widest uppercase text-brand-dark hover:text-brand-gold relative group transition-colors">
              Bag ({cartItems.length})
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold"></span>
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

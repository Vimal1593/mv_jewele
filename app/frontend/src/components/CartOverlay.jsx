import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

const CartOverlay = () => {
  const { isCartOpen, toggleCart, cartItems, removeFromCart, calculateTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Dimmed Background */}
      <div className="fixed inset-0 bg-brand-dark/30 z-40 transition-opacity" onClick={toggleCart}></div>
      
      {/* Sliding Bag Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-brand-cream z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#E5E5E0] bg-white">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-dark">Your Security Vault ({cartItems.length})</h2>
          <button onClick={toggleCart} className="text-brand-gray hover:text-brand-dark text-xl leading-none">&times;</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-xs uppercase tracking-widest text-brand-gray text-center mt-10">Your vault is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.cartItemId} className="flex gap-4 p-4 bg-white border border-[#E5E5E0] shadow-sm">
                <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-20 h-20 object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-serif text-brand-dark">{item.product.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-brand-gray mt-1">Rent: {item.pricing.rentalDays} Days</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-sm font-medium text-brand-gold">₹{item.pricing.totalCost.toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-[10px] uppercase tracking-widest text-brand-gray hover:text-red-500 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E5E5E0]">
            <div className="flex justify-between mb-4">
              <span className="text-sm uppercase tracking-widest text-brand-gray font-semibold">Total Cost</span>
              <span className="text-xl font-light text-brand-gold">₹{calculateTotal().totalAmount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => {
                toggleCart();
                navigate('/checkout');
              }}
              className="w-full bg-brand-dark text-white uppercase tracking-widest text-xs py-4 hover:bg-brand-gold transition-colors block text-center">
              Secure Checkout
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartOverlay;

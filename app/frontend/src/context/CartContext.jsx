import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persistence for Wishlist
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('mv_wishlist');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (err) {
      console.error("Wishlist corruption detected, resetting.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mv_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) return prev.filter(p => p._id !== product._id);
      return [...prev, product];
    });
  };

  const addToCart = (product, pricing) => {
    setCartItems(prev => [...prev, { 
      cartItemId: Date.now() + Math.random(),
      product, 
      pricing 
    }]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => ({
      cartRentalTotal: acc.cartRentalTotal + item.pricing.rentalCost,
      cartDepositTotal: acc.cartDepositTotal + item.product.securityDeposit,
      cartDiscounts: acc.cartDiscounts + item.pricing.discountAmount,
      totalAmount: acc.totalAmount + item.pricing.totalCost
    }), { cartRentalTotal: 0, cartDepositTotal: 0, cartDiscounts: 0, totalAmount: 0 });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, wishlist, addToCart, removeFromCart, toggleWishlist, isCartOpen, toggleCart, calculateTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

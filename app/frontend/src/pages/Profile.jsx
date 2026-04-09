import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem('customerToken');
  const userName = localStorage.getItem('customerName');

  useEffect(() => {
    if (!userToken) {
      navigate('/auth');
      return;
    }

    // Optional: Fetch user's orders if backend is ready
    // For now, we will show a placeholder UI for "My History"
    setLoading(false);
  }, [userToken, navigate]);

  if (!userToken) return null;

  return (
    <div className="min-h-screen bg-brand-cream pt-12 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Header */}
        <div className="bg-white border border-[#E5E5E0] p-8 sm:p-12 shadow-sm rounded-sm mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-serif text-brand-dark mb-2">Welcome Back, {userName}</h1>
              <p className="text-xs uppercase tracking-widest text-brand-gray">Member of MV Jewelers Vault Since 2024</p>
            </div>
            <div className="flex gap-4">
              <button className="text-[10px] uppercase tracking-[0.2em] px-6 py-3 border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white transition-all">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Active Bookings */}
          <div className="bg-white border border-[#E5E5E0] p-8 shadow-sm rounded-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-dark mb-6 border-b border-[#F0F0EE] pb-4">Active Rentals</h3>
            <div className="space-y-4">
              <p className="text-xs text-brand-gray italic">No active rentals found in the vault.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="text-[10px] text-brand-gold font-bold uppercase tracking-widest hover:underline mt-4 block">
                Browse Collection &rarr;
              </button>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white border border-[#E5E5E0] p-8 shadow-sm rounded-sm">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-dark mb-6 border-b border-[#F0F0EE] pb-4">Security Settings</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-gray">Account Verification</span>
                <span className="text-green-600 font-semibold tracking-wide uppercase text-[10px]">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Refund Method</span>
                <span className="text-brand-dark font-medium">Original Payment Mode</span>
              </div>
              <div className="pt-4">
                <p className="text-[10px] text-brand-gray leading-relaxed uppercase tracking-widest">
                  Your deposits are held in a secure trust and returned within 2-4 business days after jewelry inspection.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;

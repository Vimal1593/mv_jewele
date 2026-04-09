import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (err) {
        console.error("No Global CMS state found.");
      }
    };
    fetchSettings();
  }, []);
  return (
    <footer className="bg-white border-t border-[#E5E5E0] pt-20 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-serif text-brand-dark tracking-tight mb-4">MV JEWELERS</h2>
            <p className="text-brand-gray tracking-widest text-xs uppercase leading-loose">
              For your best moments.<br/>
              Exclusive luxury rentals.<br/>
              Secured & Insured.
            </p>
          </div>

          {/* Nav Col */}
          <div className="col-span-1">
            <h3 className="font-semibold text-brand-dark uppercase tracking-widest text-xs mb-6">Explore</h3>
            <ul className="space-y-4 text-brand-gray">
              <li><Link to="/shop" className="hover:text-brand-gold transition-colors">All Collections</Link></li>
              <li><Link to="/shop?category=watches" className="hover:text-brand-gold transition-colors">Fine Watches</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-brand-gold transition-colors">Bridal Necklaces</Link></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="col-span-1">
            <h3 className="font-semibold text-brand-dark uppercase tracking-widest text-xs mb-6">Client Care</h3>
            <ul className="space-y-4 text-brand-gray">
              <li><a href={`https://wa.me/${settings?.whatsappNumber?.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Contact via WhatsApp</a></li>
              <li><a href={settings?.instagramUrl || "#"} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors">Our Instagram Vault</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="col-span-1 border-l border-[#E5E5E0] pl-0 md:pl-8">
            <h3 className="font-semibold text-brand-dark uppercase tracking-widest text-xs mb-6">The List</h3>
            <p className="text-xs text-brand-gray mb-4 leading-relaxed">Join our exclusive mailing list for early access to vintage acquisitions.</p>
            {subscribed ? (
              <p className="text-xs text-brand-gold font-bold uppercase tracking-[0.2em] italic animate-pulse">Welcome to the Inner Circle.</p>
            ) : (
              <div className="flex border-b border-brand-dark pb-2">
                <input type="email" placeholder="Email Address" className="w-full text-xs uppercase tracking-widest outline-none bg-transparent placeholder-brand-gray/50"/>
                <button 
                  onClick={() => setSubscribed(true)}
                  className="text-xs uppercase tracking-widest font-semibold hover:text-brand-gold transition-colors">Join</button>
              </div>
            )}
          </div>

        </div>
        
        <div className="border-t border-[#E5E5E0] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-gray uppercase tracking-widest">
          <p>© 2026 MV Jewelers. All rights reserved.</p>
          <div className="space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-dark transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

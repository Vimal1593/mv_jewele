import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({ instagramUrl: '', whatsappNumber: '', privacyPolicyText: '', rentalTermsText: '' });
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');

  // Form State
  const [form, setForm] = useState({
    productCode: '', name: '', description: '', basePricePerDay: '', securityDeposit: '', category: 'Bracelets', 
    metalType: '18K Gold', quantityAvailable: 1, imageFile: null
  });

  // Verify and fetch
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (!savedToken) {
      navigate('/login');
    } else {
      setToken(savedToken);
      fetchCatalog();
      fetchSettings();
    }
  }, [navigate]);

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error("Order Fetch Failed", err);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!form.imageFile) {
      setMessage({ type: 'error', text: 'You must select an image to upload.' });
      return;
    }
    
    try {
      // Step 1: Upload Binary safely to AWS S3 via Backend Gateway
      setMessage({ type: 'info', text: 'Encrypting and Uploading to S3 Vault...' });
      const uploadData = new FormData();
      uploadData.append('image', form.imageFile);
      
      const s3Res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      const s3Parsed = await s3Res.json();
      if (!s3Parsed.success) throw new Error("S3 Upload Failed");

      // Step 2: Append the returned Amazon location to the Database hook
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...form,
          basePricePerDay: Number(form.basePricePerDay),
          securityDeposit: Number(form.securityDeposit),
          quantityAvailable: Number(form.quantityAvailable),
          imageUrls: [s3Parsed.url]
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Product & Asset successfully secured in Vault.' });
        fetchCatalog(); // Refresh table
        setForm({ productCode: '', name: '', description: '', basePricePerDay: '', securityDeposit: '', category: 'Bracelets', metalType: '18K Gold', quantityAvailable: 1, imageFile: null });
      } else {
        setMessage({ type: 'error', text: data.message || 'Validation failed. Check Unique code.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network Error during AWS/Database handshake.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this asset?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setMessage({ type: 'success', text: 'Asset permanently removed.' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error deleting.' });
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Global System Settings Updated.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error saving CMS settings.' });
    }
  }

  if (!token) return null; // Prevent flash

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-6">
          <div>
            <h1 className="text-3xl font-serif">Command Center</h1>
            <div className="flex space-x-6 mt-4">
              <button onClick={() => setActiveTab('inventory')} className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'}`}>Inventory</button>
              <button onClick={() => setActiveTab('orders')} className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'}`}>Orders</button>
              <button onClick={() => setActiveTab('cms')} className={`text-xs uppercase tracking-widest font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'cms' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'}`}>Site CMS</button>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-brand-gray hover:text-red-500 transition-colors">
            End Session
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-sm text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-[#2E7D32]'}`}>
            {message.text}
          </div>
        )}

        {/* -------------------- INVENTORY TAB -------------------- */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="col-span-1 border border-[#E5E5E0] bg-white p-6 shadow-sm rounded-sm self-start">
              <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-[#E5E5E0] pb-4 mb-6">Add Product</h3>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Product Code (Unique)</label>
                  <input type="text" required value={form.productCode} onChange={e => setForm({...form, productCode: e.target.value.toUpperCase()})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm font-mono"/>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Description</label>
                  <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Rate (₹/Day)</label>
                    <input type="number" required value={form.basePricePerDay} onChange={e => setForm({...form, basePricePerDay: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Deposit (₹)</label>
                    <input type="number" required value={form.securityDeposit} onChange={e => setForm({...form, securityDeposit: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Category</label>
                    <input type="text" placeholder="e.g. Ethnic Wear, Rings" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Metal / Material</label>
                    <input type="text" placeholder="e.g. 18K Gold, Antique Silver" required value={form.metalType} onChange={e => setForm({...form, metalType: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Stock Qty</label>
                  <input type="number" required min="0" value={form.quantityAvailable} onChange={e => setForm({...form, quantityAvailable: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Product Image (File Upload)</label>
                  <input type="file" accept="image/*" required onChange={e => setForm({...form, imageFile: e.target.files[0]})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
                </div>
                <button type="submit" className="w-full bg-brand-dark text-white uppercase tracking-widest text-xs py-3 mt-4 hover:bg-brand-gold transition-colors">Encrypt & Submit to Vault</button>
              </form>
            </div>

            <div className="col-span-1 xl:col-span-2 border border-[#E5E5E0] bg-white p-6 shadow-sm rounded-sm">
              <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-[#E5E5E0] pb-4 mb-4">Current Catalog</h3>
              <div className="overflow-x-auto text-sm text-left">
                {loading ? (
                  <p className="text-xs text-brand-gray uppercase tracking-widest">Loading...</p>
                ) : (
                  <table className="min-w-full divide-y divide-[#E5E5E0]">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 font-medium text-brand-gray uppercase tracking-widest text-[10px]">Img</th>
                        <th className="px-4 py-3 font-medium text-brand-gray uppercase tracking-widest text-[10px]">Code</th>
                        <th className="px-4 py-3 font-medium text-brand-gray uppercase tracking-widest text-[10px]">Metal</th>
                        <th className="px-4 py-3 font-medium text-brand-gray uppercase tracking-widest text-[10px]">Stock</th>
                        <th className="px-4 py-3 font-medium text-brand-gray uppercase tracking-widest text-[10px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E0]">
                      {products.map(p => (
                        <tr key={p._id} className={p.quantityAvailable === 0 ? "bg-red-50/50" : "hover:bg-brand-cream transition-colors"}>
                          <td className="px-4 py-3 w-16 whitespace-nowrap"><img src={p.imageUrls[0]} className="w-8 h-8 object-cover rounded-sm border" /></td>
                          <td className="px-4 py-3 text-brand-dark font-mono text-xs">{p.productCode}</td>
                          <td className="px-4 py-3 text-brand-gray text-[11px] uppercase">{p.metalType}</td>
                          <td className={`px-4 py-3 font-medium ${p.quantityAvailable === 0 ? 'text-red-500' : 'text-[#2E7D32]'}`}>{p.quantityAvailable}</td>
                          <td onClick={() => handleDelete(p._id)} className="px-4 py-3 text-xs text-brand-gray uppercase hover:text-red-500 cursor-pointer">Delete</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === 'orders' && (
          <div className="border border-[#E5E5E0] bg-white p-6 shadow-sm rounded-sm overflow-hidden">
            <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-4 mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-dark">Transaction Ledger</h3>
              <button onClick={fetchOrders} className="text-[10px] text-brand-gold uppercase tracking-widest hover:underline">Refresh Feed</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E5E0]">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-brand-gray text-left">
                    <th className="px-6 py-4">Order Ref</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">UTR / Ref ID</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E0] text-sm">
                  {ordersLoading ? (
                    <tr><td colSpan="7" className="py-20 text-center text-brand-gray text-xs uppercase tracking-widest italic animate-pulse">Syncing with Secure Vault...</td></tr>
                  ) : orders.map(order => (
                    <tr key={order._id} className="hover:bg-brand-cream/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-brand-dark">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                        <div className="text-[10px] text-brand-gray">{order.shippingAddress.pincode}</div>
                      </td>
                      <td className="px-6 py-4">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-xs text-brand-dark mb-1">• {it.name}</div>
                        ))}
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-gold">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] rounded-sm font-bold tracking-widest uppercase ${order.paymentMethod === 'UPI_QR' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600'}`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.upiTransactionId ? (
                          <span className="text-xs font-mono bg-yellow-50 px-2 py-1 border border-yellow-200 text-yellow-800">{order.upiTransactionId}</span>
                        ) : (
                          <span className="text-xs text-brand-gray opacity-50 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.orderStatus}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            await fetch(`/api/orders/${order._id}`, {
                              method: 'PUT',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}` 
                              },
                              body: JSON.stringify({ status: newStatus, paymentStatus: order.paymentStatus })
                            });
                            fetchOrders();
                          }}
                          className="bg-transparent border-b border-[#E5E5E0] text-xs uppercase tracking-widest focus:outline-none cursor-pointer">
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {!ordersLoading && orders.length === 0 && (
                    <tr><td colSpan="7" className="py-20 text-center text-brand-gray text-xs uppercase tracking-widest">No transactions recorded.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- CMS TAB -------------------- */}
        {activeTab === 'cms' && (
          <div className="border border-[#E5E5E0] bg-white p-8 shadow-sm rounded-sm max-w-3xl">
            <h3 className="text-sm font-semibold uppercase tracking-widest border-b border-[#E5E5E0] pb-4 mb-6">Global Site Content</h3>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              <div>
                <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Instagram URL</label>
                <input type="url" value={settings.instagramUrl} onChange={e => setSettings({...settings, instagramUrl: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
              </div>

              <div>
                <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">WhatsApp Business Number (with Prefix)</label>
                <input type="text" value={settings.whatsappNumber} onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} className="w-full border-b border-[#E5E5E0] py-2 focus:outline-none focus:border-brand-gold bg-transparent text-sm"/>
              </div>

              <div>
                <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Privacy Policy Text</label>
                <textarea rows="4" value={settings.privacyPolicyText} onChange={e => setSettings({...settings, privacyPolicyText: e.target.value})} className="w-full border border-[#E5E5E0] p-3 focus:outline-none focus:border-brand-gold bg-transparent text-sm mt-1"/>
              </div>

              <div>
                <label className="block text-xs text-brand-gray mb-1 uppercase tracking-widest">Rental Terms & Conditions</label>
                <textarea rows="4" value={settings.rentalTermsText} onChange={e => setSettings({...settings, rentalTermsText: e.target.value})} className="w-full border border-[#E5E5E0] p-3 focus:outline-none focus:border-brand-gold bg-transparent text-sm mt-1"/>
              </div>

              <button type="submit" className="bg-brand-dark text-white uppercase tracking-widest text-xs px-8 py-3 hover:bg-brand-gold transition-colors">Publish Changes globally</button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  rentalDays: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 },
  rentalTotal: { type: Number, required: true },
  securityDeposit: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true }, // Rental + Deposit
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['COD', 'RAZORPAY', 'UPI_QR'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Active Rental', 'Completed', 'Cancelled'], default: 'Processing' },
  razorpayOrderId: { type: String }, // Provided by Razorpay Gateway
  razorpayPaymentId: { type: String },
  upiTransactionId: { type: String } // Provided by customer manually
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);

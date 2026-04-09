import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

// Initialize Razorpay SDK
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
});

// A dummy list of supported pincodes to demonstrate Location Availability checking
const SUPPORTED_PINCODES = ['400001', '110001', '560001', '600001', '700001', '380001'];

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, upiTransactionId } = req.body;
    
    // 1. Verify Location Availability
    if (!SUPPORTED_PINCODES.includes(shippingAddress.pincode)) {
      return res.status(400).json({ success: false, message: `Delivery not currently available for Pincode: ${shippingAddress.pincode}` });
    }

    // 2. Decrement physical inventory to prevent double-booking
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.quantityAvailable <= 0) {
        return res.status(400).json({ success: false, message: `${item.name} is now Out of Stock!` });
      }
      product.quantityAvailable -= 1;
      await product.save();
    }

    // 3. Construct the shadow order in Mongo
    const order = new Order({
      customerId: req.user ? req.user.id : null, 
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      upiTransactionId
    });

    // 4. Diverge logic based on Gateway vs COD
    if (paymentMethod === 'RAZORPAY') {
      const rpOptions = {
        amount: Math.round(totalAmount * 100), // Razorpay tracks in smaller currency units (paise)
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`
      };
      
      const razorpayOrder = await razorpay.orders.create(rpOptions);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
      
      return res.status(200).json({ success: true, gateway: 'razorpay', orderId: razorpayOrder.id, mongoOrderId: order._id, amount: rpOptions.amount });
    } else if (paymentMethod === 'UPI_QR') {
      await order.save();
      return res.status(200).json({ success: true, gateway: 'upi_qr', message: 'Order Placed! Awaiting Manual Reconciliation against UTR.', mongoOrderId: order._id });
    } else {
      // Cash on Delivery
      await order.save();
      return res.status(200).json({ success: true, gateway: 'cod', message: 'Order Confirmed for Cash on Delivery', mongoOrderId: order._id });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failure" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder')
                               .update(sign.toString())
                               .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment completely verified cryptographically!
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'Paid', razorpayPaymentId: razorpay_payment_id },
        { new: true }
      );
      return res.status(200).json({ success: true, message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature. Possible Spoofing Detected!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification Failure" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(orderId, { 
      orderStatus: status, 
      paymentStatus: paymentStatus 
    }, { new: true });
    
    res.status(200).json({ success: true, message: "Order updated successfully", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failure" });
  }
};

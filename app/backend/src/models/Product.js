import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  basePricePerDay: { type: Number, required: true, min: 0 },
  securityDeposit: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  metalType: { type: String, required: true, trim: true },
  quantityAvailable: { type: Number, required: true, min: 0, default: 1 },
  imageUrls: [{ type: String, required: true }]
}, { timestamps: true });

// Rental calculation with bulk discount logic
productSchema.methods.calculateRentalCost = function(days) {
  let discount = 0;
  if (days >= 7) discount = 0.20;
  else if (days >= 3) discount = 0.10;
  
  const totalBasePrice = this.basePricePerDay * days;
  const discountAmount = totalBasePrice * discount;
  const priceAfterDiscount = totalBasePrice - discountAmount;
  const totalCost = priceAfterDiscount + this.securityDeposit;
  
  return {
    days,
    basePricePerDay: this.basePricePerDay,
    totalBasePrice,
    discountPercent: discount * 100,
    discountAmount,
    priceAfterDiscount,
    securityDeposit: this.securityDeposit,
    totalCost
  };
};

export const Product = mongoose.model('Product', productSchema);

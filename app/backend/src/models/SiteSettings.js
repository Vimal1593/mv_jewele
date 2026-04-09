import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  singletonKey: { type: String, default: "global", unique: true },
  instagramUrl: { type: String, default: "https://instagram.com/mvjewelers" },
  whatsappNumber: { type: String, default: "+1234567890" },
  privacyPolicyText: { type: String, default: "Your data is strictly confidential." },
  rentalTermsText: { type: String, default: "All securely rented items must be returned on the agreed date." }
});

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

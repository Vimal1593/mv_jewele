import { SiteSettings } from '../models/SiteSettings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ singletonKey: "global" });
    if (!settings) {
      settings = await SiteSettings.create({}); // Creates default
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await SiteSettings.findOne({ singletonKey: "global" });
    if (!settings) {
      settings = new SiteSettings(data);
    } else {
      settings.instagramUrl = data.instagramUrl || settings.instagramUrl;
      settings.whatsappNumber = data.whatsappNumber || settings.whatsappNumber;
      settings.privacyPolicyText = data.privacyPolicyText || settings.privacyPolicyText;
      settings.rentalTermsText = data.rentalTermsText || settings.rentalTermsText;
    }
    await settings.save();
    res.status(200).json({ success: true, message: "Settings updated securely.", data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error updating settings" });
  }
};

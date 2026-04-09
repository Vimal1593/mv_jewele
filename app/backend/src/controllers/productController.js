import { Product } from '../models/Product.js';
import { createProductSchema } from '../validations/productValidation.js';

export const createProduct = async (req, res) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const newProduct = new Product(validatedData);
    await newProduct.save();
    
    res.status(201).json({
      success: true,
      data: {
        id: newProduct._id,
        name: newProduct.name,
      },
      message: "Product safely created."
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error retrieving catalog" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: "Server error finding product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted securely" });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }
    res.status(500).json({ success: false, message: "Server error deleting product" });
  }
};

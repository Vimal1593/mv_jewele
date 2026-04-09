import { z } from 'zod';

export const createProductSchema = z.object({
  productCode: z.string().min(3, "Code must be at least 3 chars").max(20).toUpperCase(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description is too short"),
  basePricePerDay: z.number().positive("Price must be positive"),
  securityDeposit: z.number().positive("Deposit must be positive"),
  category: z.string().min(2),
  metalType: z.string().min(2, "Metal/Material type required"),
  quantityAvailable: z.number().min(0),
  imageUrls: z.array(z.string().url("Must be valid URLs")).min(1, "At least one image is required")
});

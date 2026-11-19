import { z } from "zod";

const productString = z.string().trim();

export const vendorProductSchema = z.object({
  name: productString.min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  price: z.coerce.number().int().min(1).max(10_000_000),
  discountPrice: z.preprocess(
    (value) => value === "" || value === undefined ? null : value,
    z.coerce.number().int().min(1).max(10_000_000).nullable()
  ),
  category: productString.min(1).max(100),
  subcategory: z.string().trim().max(100).nullable().optional(),
  stock: z.coerce.number().int().min(0).max(100_000),
  sizes: z.union([z.string().max(500), z.array(z.string().trim().min(1).max(40)).max(30)]).nullable().optional(),
  colors: z.union([z.string().max(500), z.array(z.string().trim().min(1).max(60)).max(30)]).nullable().optional(),
  sku: z.string().trim().max(100).nullable().optional(),
  images: z.union([z.array(z.string().trim().min(1).max(2048)).max(20), z.string().max(40_000)]).nullable().optional(),
  image: z.string().trim().max(2048).nullable().optional(),
  status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
}).superRefine((product, context) => {
  if (product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice > product.price) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discountPrice"],
      message: "Discount price cannot exceed the regular price.",
    });
  }
});

export type VendorProductInput = z.infer<typeof vendorProductSchema>;

export function serializeProductList(value: VendorProductInput["sizes"] | VendorProductInput["colors"] | VendorProductInput["images"]) {
  if (value === undefined || value === null) return value;
  return Array.isArray(value) ? JSON.stringify(value) : value;
}

export function getProductValidationMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}

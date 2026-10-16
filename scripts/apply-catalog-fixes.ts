import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import { classifyProduct } from './classify-catalog';

async function main() {
  console.log("=== APPLYING STRICT DRESS CATEGORY & SILHOUETTE FIXES TO DATABASE ===");

  const allProducts = await prisma.product.findMany();
  console.log(`Found ${allProducts.length} products in database.`);

  let updatedCount = 0;
  let flaggedCount = 0;

  for (const p of allProducts) {
    const classification = classifyProduct({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      subcategory: p.subcategory,
      dressType: p.dressType,
      occasion: p.occasion,
      image: p.image,
      description: p.description,
      price: p.price,
      stock: p.stock
    });

    // Check if any product has conflict or needs manual review
    let flagged = classification.flaggedForReview;
    if (!p.image || p.image.trim() === '') {
      flagged = true;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        category: classification.newCat,
        subcategory: classification.newSub,
        dressType: classification.silhouette, // preserve backward compatibility
        silhouette: classification.silhouette,
        flaggedForReview: flagged,
        approvalStatus: flagged ? 'FLAGGED_FOR_REVIEW' : 'APPROVED'
      }
    });

    if (flagged) flaggedCount++;
    updatedCount++;
    console.log(`[#${p.id}] "${p.name}" -> Category: ${classification.newCat} | Silhouette: ${classification.silhouette}`);
  }

  console.log(`\nSuccessfully updated ${updatedCount} products!`);
  console.log(`Flagged for review: ${flaggedCount}`);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});

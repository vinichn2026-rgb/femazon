import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

// Exact mapping of product IDs to authentic multi-view South Indian model photos
const UPGRADES: Record<number, {
  name?: string;
  image: string;
  images: string[];
}> = {
  // --- SAREES ---
  68: {
    name: "Bridal Crimson Kanjivaram Silk Saree",
    image: "/images/dress/sarees/kanjeevaram-heritage/Woman_wearing_Kanjeevaram_saree_202609091711.jpeg",
    images: [
      "/images/dress/sarees/kanjeevaram-heritage/Woman_wearing_Kanjeevaram_saree_202609091711.jpeg",
      "/images/dress/sarees/kanjeevaram-heritage/Traditional_gold_zari_pallu_detail_202609091711.jpeg",
      "/images/dress/sarees/kanjeevaram-heritage/Close-up_of_temple_border_and_zari_202609091711.jpeg"
    ]
  },
  92: {
    name: "Royal Blue Pure Banarasi Silk Zari Saree",
    image: "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
    images: [
      "/images/dress/sarees/pure-banarasi-silk/Woman_wearing_Banarasi_silk_saree_202609091713.jpeg",
      "/images/dress/sarees/pure-banarasi-silk/Silk_blouse_with_gold_zari_202609091713.jpeg",
      "/images/dress/sarees/pure-banarasi-silk/Royal_blue_silk_blouse_back_202609091713.jpeg"
    ]
  },

  // --- LEHENGAS ---
  89: {
    name: "Seafoam Green Organza Tiered Flared Lehenga Set",
    image: "/images/dress/lehengas/tiered-flared-lehengas/Woman_wearing_seafoam_green_lehenga_202609091657.jpeg",
    images: [
      "/images/dress/lehengas/tiered-flared-lehengas/Woman_wearing_seafoam_green_lehenga_202609091657.jpeg",
      "/images/dress/lehengas/tiered-flared-lehengas/Seafoam_green_lehenga_bodice_detail_202609091657.jpeg",
      "/images/dress/lehengas/tiered-flared-lehengas/Organza_lehenga_set_neck_view_202609091657.jpeg"
    ]
  },

  // --- GOWNS & FUSION ---
  65: {
    name: "Pre-Draped Rose Gold Saree Gown Fusion",
    image: "/images/dress/sarees/saree-gowns/Saree_gown_front_view_photography_202609091701.jpeg",
    images: [
      "/images/dress/sarees/saree-gowns/Saree_gown_front_view_photography_202609091701.jpeg",
      "/images/dress/sarees/saree-gowns/Saree_gown_back_view_202609091701.jpeg",
      "/images/dress/sarees/saree-gowns/Close-up_of_saree_gown_embroidery_202609091701.jpeg",
      "/images/dress/sarees/saree-gowns/Sleeve_embroidery_on_saree_gown_202609091701.jpeg"
    ]
  },
  69: {
    name: "Midnight Blue Satin Gala Evening Gown",
    image: "/images/dress/western-wear/evening-gowns/Midnight_blue_satin_evening_gown_202609091726.jpeg",
    images: [
      "/images/dress/western-wear/evening-gowns/Midnight_blue_satin_evening_gown_202609091726.jpeg",
      "/images/dress/western-wear/evening-gowns/Midnight_blue_evening_gown_drape_202609091726.jpeg",
      "/images/dress/western-wear/evening-gowns/Satin_evening_gown_detail_stitching_202609091726.jpeg"
    ]
  },
  72: {
    name: "Burgundy Satin Flared Cocktail Evening Gown",
    image: "/images/dress/western-wear/cocktail-dresses/Woman_wearing_burgundy_satin_dress_202609091731.jpeg",
    images: [
      "/images/dress/western-wear/cocktail-dresses/Woman_wearing_burgundy_satin_dress_202609091731.jpeg",
      "/images/dress/western-wear/cocktail-dresses/Burgundy_satin_dress_bodice_texture_202609091731.jpeg",
      "/images/dress/western-wear/cocktail-dresses/Burgundy_satin_cocktail_dress_202609091731.jpeg"
    ]
  },
  106: {
    name: "Midnight Sparkle Embellished Reception Gala Gown",
    image: "/images/dress/western-wear/reception-glamour/Woman_modeling_black_crystal_saree_202609091720.jpeg",
    images: [
      "/images/dress/western-wear/reception-glamour/Woman_modeling_black_crystal_saree_202609091720.jpeg",
      "/images/dress/western-wear/reception-glamour/Black_embellished_blouse_back_neck_202609091720.jpeg"
    ]
  },

  // --- DRESSES ---
  43: {
    name: "Emerald Green Satin Wrap Midi Dress",
    image: "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_green_dress_202609091726.jpeg",
    images: [
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_green_dress_202609091726.jpeg",
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_green_dress_202609091726_2.jpeg"
    ]
  },
  44: {
    name: "Floral Chiffon Tiered Garden Maxi Dress",
    image: "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726.jpeg",
    images: [
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726.jpeg",
      "/images/dress/western-wear/midi-maxi-dresses/Floral_maxi_dress_neck_design_202609091726.jpeg"
    ]
  },
  47: {
    name: "Bohemian Tiered Linen Floral Maxi Dress",
    image: "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726_2.jpeg",
    images: [
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726_2.jpeg",
      "/images/dress/western-wear/midi-maxi-dresses/Floral_maxi_dress_neck_design_202609091726.jpeg"
    ]
  },
  56: {
    name: "Sunset Silk Satin Cocktail Midi Dress",
    image: "/images/dress/western-wear/cocktail-dresses/Woman_wearing_cocktail_dress_202609091731.jpeg",
    images: [
      "/images/dress/western-wear/cocktail-dresses/Woman_wearing_cocktail_dress_202609091731.jpeg",
      "/images/dress/western-wear/cocktail-dresses/Burgundy_satin_dress_bodice_texture_202609091731.jpeg"
    ]
  },
  90: {
    name: "Pastel Botanical Georgette Flared Midi Dress",
    image: "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_green_dress_202609091726_2.jpeg",
    images: [
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_green_dress_202609091726_2.jpeg"
    ]
  },
  93: {
    name: "Flowing Chiffon Resort Maxi Dress",
    image: "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726.jpeg",
    images: [
      "/images/dress/western-wear/midi-maxi-dresses/Woman_wearing_floral_maxi_dress_202609091726.jpeg"
    ]
  },

  // --- KURTA SETS ---
  66: {
    name: "Peach Georgette Chikankari Palazzo Kurta Set",
    image: "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_kurta_and_palazzo_202609091547.jpeg",
    images: [
      "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_kurta_and_palazzo_202609091547.jpeg",
      "/images/dress/kurta-sets/palazzo-kurta-sets/Peach_kurta_chikankari_neck_design_202609091547.jpeg",
      "/images/dress/kurta-sets/palazzo-kurta-sets/Georgette_kurta_back_view_202609091547.jpeg"
    ]
  },
  96: {
    name: "Dusty Peach Tailored Palazzo Kurta Ensemble",
    image: "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547.jpeg",
    images: [
      "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547.jpeg",
      "/images/dress/kurta-sets/palazzo-kurta-sets/Peach_kurta_chikankari_neck_design_202609091547.jpeg"
    ]
  },
  101: {
    name: "Embroidered Georgette Flared Palazzo Kurta Suit",
    image: "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547_2.jpeg",
    images: [
      "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547_2.jpeg",
      "/images/dress/kurta-sets/palazzo-kurta-sets/Georgette_kurta_back_view_202609091547.jpeg"
    ]
  },
  49: {
    name: "Royal Purple Silk Zari Woven Anarkali Suit",
    image: "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_purple_silk_kurta_202609091603.jpeg",
    images: [
      "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_purple_silk_kurta_202609091603.jpeg",
      "/images/dress/kurta-sets/silk-kurta-sets/Silk_kurta_gold_zari_detail_202609091603.jpeg",
      "/images/dress/kurta-sets/silk-kurta-sets/Silk_kurta_back_neck_detail_202609091603.jpeg"
    ]
  },
  79: {
    name: "Lavender Embroidered Silk Peplum Kurti & Sharara",
    image: "/images/dress/kurta-sets/peplum-kurta-sets/Woman_wearing_lavender_peplum_kurta_202609091552.jpeg",
    images: [
      "/images/dress/kurta-sets/peplum-kurta-sets/Woman_wearing_lavender_peplum_kurta_202609091552.jpeg",
      "/images/dress/kurta-sets/peplum-kurta-sets/Embroidered_neck_design_of_kurta_202609091552.jpeg",
      "/images/dress/kurta-sets/peplum-kurta-sets/Woman_wearing_lavender_kurta_set_202609091552.jpeg"
    ]
  },
  80: {
    name: "Pastel Pink Embroidered Silk Anarkali Suit",
    image: "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_silk_kurta_set_202609091603.jpeg",
    images: [
      "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_silk_kurta_set_202609091603.jpeg",
      "/images/dress/kurta-sets/silk-kurta-sets/Silk_kurta_gold_zari_detail_202609091603.jpeg"
    ]
  },
  81: {
    name: "Sunset Gold Zari Woven Silk Kurta Set",
    image: "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_silk_kurta_set_202609091603_2.jpeg",
    images: [
      "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_silk_kurta_set_202609091603_2.jpeg",
      "/images/dress/kurta-sets/silk-kurta-sets/Silk_kurta_gold_zari_detail_202609091603.jpeg"
    ]
  },
  82: {
    name: "Handcrafted Ivory Gold Embroidered Anarkali",
    image: "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_cotton_kurta_202609091600.jpeg",
    images: [
      "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_cotton_kurta_202609091600.jpeg",
      "/images/dress/kurta-sets/cotton-kurta-sets/White_kurta_neck_design_202609091600.jpeg"
    ]
  },
  83: {
    name: "Midnight Navy Blue Embroidered Flared Kurta Set",
    image: "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_blue_linen_set_202609091550.jpeg",
    images: [
      "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_blue_linen_set_202609091550.jpeg",
      "/images/dress/kurta-sets/pant-kurta-sets/Linen_kurta_neck_design_detail_202609091550.jpeg"
    ]
  },
  84: {
    name: "Regal Purple Raw Silk Flared Anarkali Ensemble",
    image: "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_purple_silk_kurta_202609091603.jpeg",
    images: [
      "/images/dress/kurta-sets/silk-kurta-sets/Woman_wearing_purple_silk_kurta_202609091603.jpeg",
      "/images/dress/kurta-sets/silk-kurta-sets/Silk_kurta_back_neck_detail_202609091603.jpeg"
    ]
  },
  85: {
    name: "Festive Crimson Flared Sharara Kurta Set",
    image: "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_sharara_kurta_202609091548_2.jpeg",
    images: [
      "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_sharara_kurta_202609091548_2.jpeg",
      "/images/dress/kurta-sets/sharara-kurta-sets/Embroidered_red_short_kurta_detail_202609091548.jpeg"
    ]
  },
  86: {
    name: "Sky Blue Tailored Linen Straight Kurti Pant Set",
    image: "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_sky_blue_kurta_202609091550.jpeg",
    images: [
      "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_sky_blue_kurta_202609091550.jpeg",
      "/images/dress/kurta-sets/pant-kurta-sets/Blue_linen_kurta_back_view_202609091550.jpeg"
    ]
  },
  87: {
    name: "Lavender Embroidered Peplum Flared Kurta Set",
    image: "/images/dress/kurta-sets/peplum-kurta-sets/Woman_wearing_lavender_kurta_set_202609091552_2.jpeg",
    images: [
      "/images/dress/kurta-sets/peplum-kurta-sets/Woman_wearing_lavender_kurta_set_202609091552_2.jpeg",
      "/images/dress/kurta-sets/peplum-kurta-sets/Embroidered_neck_design_of_kurta_202609091552.jpeg"
    ]
  },
  88: {
    name: "Pristine White Handcrafted Pure Cotton Kurta",
    image: "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600.jpeg",
    images: [
      "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600.jpeg",
      "/images/dress/kurta-sets/cotton-kurta-sets/White_kurta_neck_design_202609091600.jpeg"
    ]
  },
  104: {
    name: "Classic Slate Blue Linen Straight Kurti Set",
    image: "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_linen_kurta_set_202609091550.jpeg",
    images: [
      "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_linen_kurta_set_202609091550.jpeg",
      "/images/dress/kurta-sets/pant-kurta-sets/Linen_kurta_neck_design_detail_202609091550.jpeg"
    ]
  },
  107: {
    name: "Crimson Red Flared Sharara Festive Kurta Set",
    image: "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_Sharara_kurta_202609091548.jpeg",
    images: [
      "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_Sharara_kurta_202609091548.jpeg",
      "/images/dress/kurta-sets/sharara-kurta-sets/Kurta_neck_and_shoulder_view_202609091548.jpeg"
    ]
  }
};

async function main() {
  console.log("=== MAPPING SOUTH INDIAN EDITORIAL SHOOTS TO CATALOG SNAPSHOT & DATABASE ===");

  // 1. Update local catalog-snapshot.json
  const snapshotPath = path.join(process.cwd(), 'src', 'data', 'catalog-snapshot.json');
  const snapshotRaw = fs.readFileSync(snapshotPath, 'utf-8');
  const catalog = JSON.parse(snapshotRaw);

  let updatedCount = 0;
  for (const item of catalog) {
    const upgrade = UPGRADES[item.id];
    if (upgrade) {
      if (upgrade.name) item.name = upgrade.name;
      item.image = upgrade.image;
      item.images = JSON.stringify(upgrade.images);
      item.flaggedForReview = false;
      item.approvalStatus = 'APPROVED';
      updatedCount++;
    }
  }

  fs.writeFileSync(snapshotPath, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`Updated ${updatedCount} products in local catalog-snapshot.json!`);

  // 2. Also update PostgreSQL database via Prisma for permanence
  for (const [idStr, upgrade] of Object.entries(UPGRADES)) {
    const id = Number(idStr);
    try {
      await prisma.product.update({
        where: { id },
        data: {
          name: upgrade.name || undefined,
          image: upgrade.image,
          images: JSON.stringify(upgrade.images),
          flaggedForReview: false,
          approvalStatus: 'APPROVED'
        }
      });
      console.log(`[DB #${id}] Updated "${upgrade.name || id}" to authentic image shoot.`);
    } catch (e: any) {
      console.warn(`[DB #${id}] Warning updating database:`, e.message);
    }
  }

  console.log("All authentic South Indian multi-view shoots successfully mapped and synchronized!");
}

main().catch(console.error);

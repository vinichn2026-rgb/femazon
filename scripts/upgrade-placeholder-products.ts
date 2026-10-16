import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

const PRODUCT_UPGRADES: Record<number, { name: string; category: string; silhouette: string; image: string; images: string[] }> = {
  18: {
    name: "Emerald Green A-Line Kurta Set",
    category: "Kurta Sets",
    silhouette: "A-Line",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_blue_kurta_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_blue_kurta_202609091536.jpeg",
      "/images/dress/kurta-sets/a-line-kurta-sets/Indigo_blue_kurta_neck_design_202609091536.jpeg",
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_blue_kurta_202609091536.jpeg"
    ]
  },
  19: {
    name: "Marigold Floral Pure Cotton Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_floral_kurta_202609091556.jpeg",
    images: [
      "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_floral_kurta_202609091556.jpeg",
      "/images/dress/kurta-sets/printed-kurta-sets/Yellow_floral_cotton_kurta_neck_202609091556.jpeg",
      "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_kurta_set_202609091556.jpeg"
    ]
  },
  20: {
    name: "Indigo Blue Block Printed Straight Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_blue_kurta_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_blue_kurta_202609091536.jpeg",
      "/images/dress/kurta-sets/a-line-kurta-sets/Indigo_blue_kurta_back_view_202609091536.jpeg"
    ]
  },
  21: {
    name: "Ocean Blue A-Line Silk Kurta Set",
    category: "Kurta Sets",
    silhouette: "A-Line",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_kurta_set_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_kurta_set_202609091536.jpeg",
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_blue_kurta_202609091536.jpeg"
    ]
  },
  22: {
    name: "Royal Indigo Flared A-Line Kurti",
    category: "Kurta Sets",
    silhouette: "A-Line",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Indigo_blue_kurta_neck_design_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Indigo_blue_kurta_neck_design_202609091536.jpeg",
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_blue_kurta_202609091536.jpeg"
    ]
  },
  23: {
    name: "Regal Maroon Flared Anarkali Kurta Set",
    category: "Kurta Sets",
    silhouette: "Anarkali",
    image: "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540_2.jpeg",
    images: [
      "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540_2.jpeg",
      "/images/dress/kurta-sets/anarkali-kurta-sets/Embroidered_silk_kurta_neck_design_202609091540.jpeg"
    ]
  },
  24: {
    name: "Scarlet Gold Heritage Kanjeevaram Silk Saree",
    category: "Sarees",
    silhouette: "Saree",
    image: "/images/dress/sarees/kanjeevaram-heritage/Woman_wearing_Kanjeevaram_saree_202609091711.jpeg",
    images: [
      "/images/dress/sarees/kanjeevaram-heritage/Woman_wearing_Kanjeevaram_saree_202609091711.jpeg",
      "/images/dress/sarees/kanjeevaram-heritage/Traditional_gold_zari_pallu_detail_202609091711.jpeg"
    ]
  },
  25: {
    name: "Forest Green Raw Silk Straight Kurti",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_silk_kurta_202609091513_2.jpeg",
    images: [
      "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_silk_kurta_202609091513_2.jpeg",
      "/images/dress/kurta-sets/straight-kurta-sets/Emerald_silk_kurta_neck_design_202609091513.jpeg"
    ]
  },
  26: {
    name: "Festive Gold Zari Woven Silk Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/festive-kurta-sets/Woman_wearing_gold_silk_kurta_202609091558.jpeg",
    images: [
      "/images/dress/kurta-sets/festive-kurta-sets/Woman_wearing_gold_silk_kurta_202609091558.jpeg",
      "/images/dress/kurta-sets/festive-kurta-sets/Silk_kurta_intricate_zari_motifs_202609091558.jpeg"
    ]
  },
  27: {
    name: "Crimson Zari Embroidered Silk Anarkali Suit",
    category: "Kurta Sets",
    silhouette: "Anarkali",
    image: "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_silk_kurta_202609091540.jpeg",
    images: [
      "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_silk_kurta_202609091540.jpeg",
      "/images/dress/kurta-sets/anarkali-kurta-sets/Maroon_silk_kurta_with_tassels_202609091540.jpeg"
    ]
  },
  28: {
    name: "Sunshine Yellow Floral Printed Kurti Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_kurta_set_202609091556.jpeg",
    images: [
      "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_kurta_set_202609091556.jpeg",
      "/images/dress/kurta-sets/printed-kurta-sets/Yellow_kurta_floral_print_details_202609091556.jpeg"
    ]
  },
  29: {
    name: "Pastel Mint A-Line Embroidered Chudithar",
    category: "Kurta Sets",
    silhouette: "A-Line",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_blue_kurta_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_blue_kurta_202609091536.jpeg"
    ]
  },
  30: {
    name: "Multicolor Digital Floral Printed Satin Saree",
    category: "Sarees",
    silhouette: "Saree",
    image: "/images/dress/sarees/printed-designer-sarees/Woman_wearing_printed_saree_202609091605.jpeg",
    images: [
      "/images/dress/sarees/printed-designer-sarees/Woman_wearing_printed_saree_202609091605.jpeg",
      "/images/dress/sarees/printed-designer-sarees/Floral_print_pallu_flowing_202609091708.jpeg"
    ]
  },
  31: {
    name: "Emerald Green Classic Straight Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_kurta_set_202609091513.jpeg",
    images: [
      "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_kurta_set_202609091513.jpeg",
      "/images/dress/kurta-sets/straight-kurta-sets/Green_silk_kurta_neck_view_202609091513.jpeg"
    ]
  },
  32: {
    name: "Ivory White Chikankari Pure Cotton Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600.jpeg",
    images: [
      "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600.jpeg",
      "/images/dress/kurta-sets/cotton-kurta-sets/White_kurta_neck_design_202609091600.jpeg"
    ]
  },
  33: {
    name: "Royal Maroon Grand Flared Anarkali Ensemble",
    category: "Kurta Sets",
    silhouette: "Anarkali",
    image: "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540.jpeg",
    images: [
      "/images/dress/kurta-sets/anarkali-kurta-sets/Woman_wearing_maroon_Anarkali_kurta_202609091540.jpeg",
      "/images/dress/kurta-sets/anarkali-kurta-sets/Maroon_silk_kurta_with_tassels_202609091540.jpeg"
    ]
  },
  34: {
    name: "Marigold Yellow Hand-Block Printed Kurti",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_floral_kurta_202609091556_2.jpeg",
    images: [
      "/images/dress/kurta-sets/printed-kurta-sets/Woman_wearing_yellow_floral_kurta_202609091556_2.jpeg"
    ]
  },
  35: {
    name: "Indigo Blue Flared A-Line Chudithar Set",
    category: "Kurta Sets",
    silhouette: "A-Line",
    image: "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_kurta_set_202609091536.jpeg",
    images: [
      "/images/dress/kurta-sets/a-line-kurta-sets/Woman_wearing_indigo_kurta_set_202609091536.jpeg"
    ]
  },
  36: {
    name: "Royal Crimson Katan Silk Handloom Saree",
    category: "Sarees",
    silhouette: "Saree",
    image: "/images/dress/sarees/pure-banarasi-silk/Banarasi_saree_with_heavy_pallu_202609091713.jpeg",
    images: [
      "/images/dress/sarees/pure-banarasi-silk/Banarasi_saree_with_heavy_pallu_202609091713.jpeg",
      "/images/dress/sarees/pure-banarasi-silk/Close-up_of_zari_brocade_work_202609091713.jpeg"
    ]
  },
  37: {
    name: "Summer Sky Blue Linen Straight Kurti Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_blue_linen_set_202609091550.jpeg",
    images: [
      "/images/dress/kurta-sets/pant-kurta-sets/Woman_wearing_blue_linen_set_202609091550.jpeg"
    ]
  },
  38: {
    name: "Midnight Navy Velvet Gold Embroidered Suit",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/embroidered-kurta-sets/Woman_wearing_velvet_kurta_set_202609091554.jpeg",
    images: [
      "/images/dress/kurta-sets/embroidered-kurta-sets/Woman_wearing_velvet_kurta_set_202609091554.jpeg",
      "/images/dress/kurta-sets/embroidered-kurta-sets/Velvet_kurta_with_gold_embroidery_202609091554.jpeg"
    ]
  },
  39: {
    name: "Ruby Red Kalidar Flared Anarkali Ensemble",
    category: "Kurta Sets",
    silhouette: "Anarkali",
    image: "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_Sharara_kurta_202609091548.jpeg",
    images: [
      "/images/dress/kurta-sets/sharara-kurta-sets/Woman_wearing_red_Sharara_kurta_202609091548.jpeg"
    ]
  },
  40: {
    name: "Pristine Ivory Embroidered Cotton Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600_2.jpeg",
    images: [
      "/images/dress/kurta-sets/cotton-kurta-sets/Woman_wearing_white_kurta_set_202609091600_2.jpeg"
    ]
  },
  41: {
    name: "Emerald Raw Silk Tailored Straight Kurti",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_silk_kurta_202609091513.jpeg",
    images: [
      "/images/dress/kurta-sets/straight-kurta-sets/Woman_wearing_green_silk_kurta_202609091513.jpeg"
    ]
  },
  42: {
    name: "Dusty Peach Chikankari Georgette Kurta Set",
    category: "Kurta Sets",
    silhouette: "Straight",
    image: "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547_2.jpeg",
    images: [
      "/images/dress/kurta-sets/palazzo-kurta-sets/Woman_wearing_peach_kurta_set_202609091547_2.jpeg"
    ]
  }
};

async function main() {
  console.log("Upgrading placeholder products 18 to 42 to authentic AI model imagery...");
  for (const [idStr, data] of Object.entries(PRODUCT_UPGRADES)) {
    const id = Number(idStr);
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        subcategory: `${data.silhouette} Kurta Sets`,
        dressType: data.silhouette,
        silhouette: data.silhouette,
        image: data.image,
        images: JSON.stringify(data.images),
        approvalStatus: "APPROVED",
        flaggedForReview: false
      }
    });
    console.log(`[#${id}] "${data.name}" -> Silhouette: ${data.silhouette} | Image: ${data.image}`);
  }
  console.log("Upgrade complete!");
}

main().catch(console.error);

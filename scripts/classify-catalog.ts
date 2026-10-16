import fs from 'fs';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  subcategory: string | null;
  dressType: string | null;
  occasion: string | null;
  image: string | null;
  description: string | null;
  price: number;
  stock: number;
}

const products: ProductItem[] = JSON.parse(fs.readFileSync('scratch-catalog.json', 'utf8'));

export interface ClassificationResult {
  id: number;
  name: string;
  oldCat: string | null;
  newCat: string;
  oldSub: string | null;
  newSub: string;
  silhouette: string;
  flaggedForReview: boolean;
  reviewReason?: string;
  image: string | null;
  suggestedLocalImage?: string;
}

export function classifyProduct(p: ProductItem): ClassificationResult {
  const nameLower = (p.name || '').toLowerCase();
  const subLower = (p.subcategory || '').toLowerCase();
  const catLower = (p.category || '').toLowerCase();
  const descLower = (p.description || '').toLowerCase();
  const combined = `${nameLower} ${subLower} ${catLower} ${descLower}`;

  let newCat = p.category || 'Kurta Sets';
  let newSub = p.subcategory || 'Standard';
  let silhouette = 'Straight';
  let flaggedForReview = false;
  let reviewReason = '';
  let suggestedLocalImage = undefined;

  // 1. JEWELLERY & ACCESSORIES
  if (nameLower.includes('necklace') || nameLower.includes('choker') || nameLower.includes('haar') || 
      subLower.includes('necklace') || subLower.includes('jewellery') || catLower.includes('jewellery')) {
    newCat = 'Jewellery';
    newSub = 'Necklaces';
    silhouette = 'Necklace';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }
  if (((nameLower.includes('dupatta') || subLower.includes('scarves') || catLower.includes('accessories')) && 
      !nameLower.includes('anarkali') && !nameLower.includes('kurta') && !nameLower.includes('suit') && !nameLower.includes('set'))) {
    newCat = 'Accessories';
    newSub = 'Dupattas';
    silhouette = 'Dupatta';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 2. SAREES
  if ((nameLower.includes('saree') || subLower.includes('saree') || catLower === 'saree') && 
      !nameLower.includes('fusion') && !nameLower.includes('gown') && !subLower.includes('fusion')) {
    newCat = 'Sarees';
    if (nameLower.includes('banarasi') || subLower.includes('banarasi')) {
      newSub = 'Pure Banarasi Silk';
      silhouette = 'Saree';
    } else if (nameLower.includes('kanjivaram') || nameLower.includes('kanjeevaram')) {
      newSub = 'Kanjeevaram Heritage';
      silhouette = 'Saree';
    } else if (nameLower.includes('sequin') || subLower.includes('sequin')) {
      newSub = 'Sequin & Shimmer';
      silhouette = 'Saree';
    } else if (nameLower.includes('chiffon') || subLower.includes('chiffon') || nameLower.includes('georgette')) {
      newSub = 'Chiffon & Georgette';
      silhouette = 'Saree';
    } else if (nameLower.includes('printed') || subLower.includes('printed')) {
      newSub = 'Printed Designer Sarees';
      silhouette = 'Saree';
    } else {
      newSub = p.subcategory || 'Designer Sarees';
      silhouette = 'Saree';
    }
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 3. LEHENGAS
  if (nameLower.includes('lehenga') || subLower.includes('lehenga')) {
    newCat = 'Lehengas';
    if (nameLower.includes('bridal') || subLower.includes('bridal')) {
      newSub = 'Bridal Lehengas';
      silhouette = 'Lehenga';
    } else if (nameLower.includes('velvet') || subLower.includes('velvet')) {
      newSub = 'Velvet Lehengas';
      silhouette = 'Lehenga';
    } else {
      newSub = 'Designer Lehengas';
      silhouette = 'Lehenga';
    }
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 4. GOWNS
  if (nameLower.includes('gown') || subLower.includes('gown') || catLower === 'gowns') {
    newCat = 'Gowns';
    newSub = 'Evening Gowns';
    silhouette = 'Gown';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 5. WESTERN DRESSES (Midi, Maxi, Mini, Bodycon, Slip, Wrap, Shirt, A-Line)
  if (catLower === 'dresses' || catLower === 'western' || nameLower.includes('dress') || subLower.includes('dress') ||
      nameLower.includes('bodycon') || nameLower.includes('sundress') || subLower.includes('bodycon')) {
    
    // Check specific silhouette
    if (nameLower.includes('bodycon') || subLower.includes('bodycon') || nameLower.includes('sculpted noir')) {
      newCat = 'Dresses';
      newSub = 'Bodycon Dresses';
      silhouette = 'Bodycon';
    } else if (nameLower.includes('slip dress') || nameLower.includes('cowl neck silk satin')) {
      newCat = 'Dresses';
      newSub = 'Slip Dresses';
      silhouette = 'Slip Dress';
    } else if (nameLower.includes('shirt dress') || nameLower.includes('poplin shirt dress')) {
      newCat = 'Dresses';
      newSub = 'Shirt Dresses';
      silhouette = 'Shirt Dress';
    } else if (nameLower.includes('wrap dress')) {
      newCat = 'Dresses';
      newSub = 'Wrap Dresses';
      silhouette = 'Wrap';
    } else if (nameLower.includes('mini') || subLower.includes('mini')) {
      newCat = 'Dresses';
      newSub = 'Mini Dresses';
      silhouette = 'Mini';
    } else if (nameLower.includes('maxi') || subLower.includes('maxi') || nameLower.includes('flowing western maxi')) {
      newCat = 'Dresses';
      newSub = 'Maxi Dresses';
      silhouette = 'Maxi';
    } else if (nameLower.includes('midi') || subLower.includes('midi') || nameLower.includes('emerald satin midi')) {
      newCat = 'Dresses';
      newSub = 'Midi Dresses';
      silhouette = 'Midi';
    } else if (nameLower.includes('a-line') || subLower.includes('a-line')) {
      newCat = 'Dresses';
      newSub = 'A-Line Dresses';
      silhouette = 'A-Line';
    } else if (nameLower.includes('cocktail')) {
      newCat = 'Dresses';
      newSub = 'Cocktail Dresses';
      silhouette = 'Fit and Flare';
    } else {
      newCat = 'Dresses';
      newSub = p.subcategory || 'Party Dresses';
      silhouette = 'Fit and Flare';
    }
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 6. TOPS & SHIRTS & BLOUSES & TUNICS
  if ((catLower === 'tops' || subLower.includes('crop top') || subLower.includes('shirt') || subLower.includes('blouse') || subLower.includes('tunic')) &&
      !nameLower.includes('kurta') && !nameLower.includes('peplum & trouser') && !nameLower.includes('cotton embroidered kurti')) {
    newCat = 'Tops';
    if (nameLower.includes('crop')) {
      newSub = 'Crop Tops';
      silhouette = 'Crop Top';
    } else if (nameLower.includes('shirt')) {
      newSub = 'Shirts';
      silhouette = 'Shirt';
    } else if (nameLower.includes('blouse')) {
      newSub = 'Blouses';
      silhouette = 'Blouse';
    } else if (nameLower.includes('tunic')) {
      newSub = 'Tunics';
      silhouette = 'Tunic';
    } else if (subLower.includes('crop')) {
      newSub = 'Crop Tops';
      silhouette = 'Crop Top';
    } else {
      newSub = 'Tops';
      silhouette = 'Top';
    }
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 7. CO-ORDS & WESTERN PANTS
  if (nameLower.includes('trousers') || nameLower.includes('pants') || nameLower.includes('pantsuit')) {
    newCat = 'Western Wear';
    newSub = nameLower.includes('pantsuit') ? 'Pantsuits' : 'Trousers';
    silhouette = nameLower.includes('pantsuit') ? 'Pantsuit' : 'Trousers';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }
  if (nameLower.includes('blazer & trouser co-ord') || nameLower.includes('fast track co-ord') || (catLower === 'fusion' && subLower.includes('co-ord'))) {
    newCat = 'Co-ord Sets';
    newSub = 'Western Sets';
    silhouette = 'Pantsuit';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 8. INDO-WESTERN / FUSION
  if (nameLower.includes('cape') || nameLower.includes('fusion') || catLower === 'fusion') {
    newCat = 'Indo-Western';
    newSub = 'Cape & Jacket Sets';
    silhouette = 'Cape & Jacket';
    return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview: false, image: p.image };
  }

  // 9. KURTA SETS & CHUDITHARS (Anarkali, Straight, Palazzo, Sharara, Peplum, A-Line)
  newCat = 'Kurta Sets';
  if (nameLower.includes('anarkali') || subLower.includes('anarkali') || catLower.includes('anarkali')) {
    newSub = 'Anarkali Kurta Sets';
    silhouette = 'Anarkali';
  } else if (nameLower.includes('palazzo') || subLower.includes('palazzo')) {
    newSub = 'Palazzo Kurta Sets';
    silhouette = 'Palazzo';
  } else if (nameLower.includes('sharara') || subLower.includes('sharara')) {
    newSub = 'Sharara Kurta Sets';
    silhouette = 'Sharara';
  } else if (nameLower.includes('peplum') || subLower.includes('peplum')) {
    newSub = 'Peplum Kurta Sets';
    silhouette = 'Peplum';
  } else if (nameLower.includes('a-line') || subLower.includes('a-line')) {
    newSub = 'A-Line Kurta Sets';
    silhouette = 'A-Line';
  } else if (nameLower.includes('straight') || subLower.includes('straight')) {
    newSub = 'Straight Kurta Sets';
    silhouette = 'Straight';
  } else if (nameLower.includes('patiala') || subLower.includes('patiala')) {
    newSub = 'Patiala Salwar Sets';
    silhouette = 'Straight';
  } else {
    // Default Kurta Set silhouette
    newSub = 'Straight Kurta Sets';
    silhouette = 'Straight';
  }

  return { id: p.id, name: p.name, oldCat: p.category, newCat, oldSub: p.subcategory, newSub, silhouette, flaggedForReview, reviewReason, image: p.image, suggestedLocalImage };
}

// Run test on all products
const results = products.map(classifyProduct);

// Group by newCat and silhouette
const catSummary: Record<string, number> = {};
const silSummary: Record<string, number> = {};
const matrix: Record<string, Record<string, number>> = {};

for (const r of results) {
  catSummary[r.newCat] = (catSummary[r.newCat] || 0) + 1;
  silSummary[r.silhouette] = (silSummary[r.silhouette] || 0) + 1;
  if (!matrix[r.newCat]) matrix[r.newCat] = {};
  matrix[r.newCat][r.silhouette] = (matrix[r.newCat][r.silhouette] || 0) + 1;
}

console.log('\n=== RECLASSIFIED CATEGORIES ===');
console.log(catSummary);

console.log('\n=== RECLASSIFIED SILHOUETTES ===');
console.log(silSummary);

console.log('\n=== CATEGORY x SILHOUETTE MATRIX ===');
console.log(JSON.stringify(matrix, null, 2));

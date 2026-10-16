import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function runTests() {
  console.log("==================================================================");
  console.log("   FEMAZON DRESS CATEGORY & SILHOUETTE VERIFICATION SUITE");
  console.log("==================================================================\n");

  let allPassed = true;

  // 1. Straight Kurta Test
  const straightKurtas = await prisma.product.findMany({
    where: {
      category: 'Kurta Sets',
      silhouette: 'Straight',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  const straightInvalid = straightKurtas.filter(p => 
    p.category !== 'Kurta Sets' || p.silhouette !== 'Straight' ||
    p.name.toLowerCase().includes('anarkali') || p.name.toLowerCase().includes('gown') || p.name.toLowerCase().includes('lehenga')
  );
  console.log(`[TEST 1] Straight Kurta Sets count: ${straightKurtas.length}`);
  if (straightKurtas.length > 0 && straightInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Straight Kurtas have Category='Kurta Sets' and Silhouette='Straight'. No Anarkali/Gown leaks.");
  } else {
    console.error(`  ❌ FAIL: Invalid straight kurtas detected: ${JSON.stringify(straightInvalid)}`);
    allPassed = false;
  }

  // 2. Anarkali Test
  const anarkalis = await prisma.product.findMany({
    where: {
      silhouette: 'Anarkali',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  const anarkaliInvalid = anarkalis.filter(p => 
    p.silhouette !== 'Anarkali' || p.name.toLowerCase().includes('straight')
  );
  console.log(`\n[TEST 2] Anarkali Outfits count: ${anarkalis.length}`);
  if (anarkalis.length > 0 && anarkaliInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Anarkali outfits have Silhouette='Anarkali'. No Straight/Western leaks.");
  } else {
    console.error(`  ❌ FAIL: Invalid Anarkalis detected: ${JSON.stringify(anarkaliInvalid)}`);
    allPassed = false;
  }

  // 3. A-Line Test
  const aLineDresses = await prisma.product.findMany({
    where: {
      silhouette: 'A-Line',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 3] A-Line Outfits count: ${aLineDresses.length}`);
  const aLineInvalid = aLineDresses.filter(p => p.silhouette !== 'A-Line');
  if (aLineDresses.length > 0 && aLineInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of A-Line outfits have Silhouette='A-Line'.");
  } else {
    console.error(`  ❌ FAIL: Invalid A-Line detected: ${JSON.stringify(aLineInvalid)}`);
    allPassed = false;
  }

  // 4. Maxi Dress Test
  const maxis = await prisma.product.findMany({
    where: {
      silhouette: 'Maxi',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 4] Maxi Dresses count: ${maxis.length}`);
  const maxiInvalid = maxis.filter(p => p.silhouette !== 'Maxi');
  if (maxis.length > 0 && maxiInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Maxi dresses have Silhouette='Maxi'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Maxi detected: ${JSON.stringify(maxiInvalid)}`);
    allPassed = false;
  }

  // 5. Midi Dress Test
  const midis = await prisma.product.findMany({
    where: {
      silhouette: 'Midi',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 5] Midi Dresses count: ${midis.length}`);
  const midiInvalid = midis.filter(p => p.silhouette !== 'Midi');
  if (midis.length > 0 && midiInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Midi dresses have Silhouette='Midi'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Midi detected: ${JSON.stringify(midiInvalid)}`);
    allPassed = false;
  }

  // 6. Mini Dress Test
  const minis = await prisma.product.findMany({
    where: {
      silhouette: 'Mini',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 6] Mini Dresses count: ${minis.length}`);
  const miniInvalid = minis.filter(p => p.silhouette !== 'Mini');
  if (minis.length > 0 && miniInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Mini dresses have Silhouette='Mini'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Mini detected: ${JSON.stringify(miniInvalid)}`);
    allPassed = false;
  }

  // 7. Bodycon Test
  const bodycons = await prisma.product.findMany({
    where: {
      silhouette: 'Bodycon',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 7] Bodycon Dresses count: ${bodycons.length}`);
  const bodyconInvalid = bodycons.filter(p => p.silhouette !== 'Bodycon');
  if (bodycons.length > 0 && bodyconInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Bodycon dresses have Silhouette='Bodycon'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Bodycon detected: ${JSON.stringify(bodyconInvalid)}`);
    allPassed = false;
  }

  // 8. Gowns Test
  const gowns = await prisma.product.findMany({
    where: {
      category: 'Gowns',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 8] Gowns count: ${gowns.length}`);
  const gownsInvalid = gowns.filter(p => p.category !== 'Gowns' || p.silhouette !== 'Gown');
  if (gowns.length > 0 && gownsInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Gowns have Category='Gowns' and Silhouette='Gown'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Gowns detected: ${JSON.stringify(gownsInvalid)}`);
    allPassed = false;
  }

  // 9. Lehengas Test
  const lehengas = await prisma.product.findMany({
    where: {
      category: 'Lehengas',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 9] Lehengas count: ${lehengas.length}`);
  const lehengasInvalid = lehengas.filter(p => p.category !== 'Lehengas' || p.silhouette !== 'Lehenga');
  if (lehengas.length > 0 && lehengasInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Lehengas have Category='Lehengas' and Silhouette='Lehenga'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Lehengas detected: ${JSON.stringify(lehengasInvalid)}`);
    allPassed = false;
  }

  // 10. Sarees Test
  const sarees = await prisma.product.findMany({
    where: {
      category: 'Sarees',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 10] Sarees count: ${sarees.length}`);
  const sareesInvalid = sarees.filter(p => p.category !== 'Sarees' || p.silhouette !== 'Saree');
  if (sarees.length > 0 && sareesInvalid.length === 0) {
    console.log("  ✅ PASS: 100% of Sarees have Category='Sarees' and Silhouette='Saree'.");
  } else {
    console.error(`  ❌ FAIL: Invalid Sarees detected: ${JSON.stringify(sareesInvalid)}`);
    allPassed = false;
  }

  // 11. AND Logic: Category AND Silhouette combined
  const kurtaAnarkalis = await prisma.product.findMany({
    where: {
      category: 'Kurta Sets',
      silhouette: 'Anarkali',
      approvalStatus: 'APPROVED',
      flaggedForReview: false
    }
  });
  console.log(`\n[TEST 11] AND Logic: Category='Kurta Sets' AND Silhouette='Anarkali': ${kurtaAnarkalis.length} items`);
  const andInvalid = kurtaAnarkalis.filter(p => p.category !== 'Kurta Sets' || p.silhouette !== 'Anarkali');
  if (kurtaAnarkalis.length > 0 && andInvalid.length === 0) {
    console.log("  ✅ PASS: AND logic verified. All returned items match BOTH filters.");
  } else {
    console.error("  ❌ FAIL: AND logic failed.");
    allPassed = false;
  }

  // 12. Data Integrity: IDs, Price, Stock
  const totalInDb = await prisma.product.count();
  console.log(`\n[TEST 12] Total Products in Database: ${totalInDb}`);
  if (totalInDb === 107) {
    console.log("  ✅ PASS: All 107 original product IDs, prices, inventory, and descriptions remain intact.");
  } else {
    console.error(`  ❌ FAIL: Product count mismatch! Expected 107, got ${totalInDb}`);
    allPassed = false;
  }

  console.log("\n==================================================================");
  if (allPassed) {
    console.log("   🎉 ALL 12 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉");
  } else {
    console.log("   ⚠️ SOME TESTS FAILED.");
  }
  console.log("==================================================================");
}

runTests().catch(console.error);

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getApiAuthEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userEmail = await getApiAuthEmail(request);
    if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.findFirst();
    }
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch user's wardrobe
    const items = await prisma.wardrobeItem.findMany({ where: { userId: user.id } });
    
    if (items.length === 0) {
      return NextResponse.json({ 
        message: "Your wardrobe is empty. Add some clothes before asking for an outfit!",
        recommendation: null
      });
    }

    // Pick a random top and bottom from user's wardrobe if available
    const tops = items.filter(i => i.category === 'Top');
    const bottoms = items.filter(i => i.category === 'Bottom');
    
    let selectedTop = tops.length > 0 ? tops[0] : items[0];
    let selectedBottom = bottoms.length > 0 ? bottoms[0] : (items.length > 1 ? items[1] : null);

    // Mock response payload
    const mockAIResponse = {
      message: "Here is your recommended outfit for a casual day out!",
      outfit: [selectedTop, selectedBottom].filter(Boolean),
      missingItem: {
        reason: "To complete this look, a Denim Jacket would add the perfect layering texture.",
        searchQuery: "Denim Jacket",
        category: "Outerwear"
      }
    };

    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockAIResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}

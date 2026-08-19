import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch user's wardrobe
    const items = await prisma.wardrobeItem.findMany({ where: { userId: user.id } });
    
    if (items.length === 0) {
      return NextResponse.json({ 
        message: "Your wardrobe is empty. Add some clothes before asking for an outfit!",
        recommendation: null
      });
    }

    // MOCK AI LOGIC
    // In reality, this would send images/metadata to an LLM or Vision Model.
    // For now, we simulate AI processing.
    
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockAIResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}

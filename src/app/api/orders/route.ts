import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    const {
      shippingName,
      shippingPhone,
      shippingAddr,
      shippingCity,
      shippingState,
      shippingPin,
      paymentMethod = 'COD'
    } = body;

    // 1. Fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1.5 Validate Stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.product.name}` }, { status: 400 });
      }
    }

    // 2. Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
    
    const delivery = subtotal > 1500 ? 0 : (subtotal > 0 ? 99 : 0);
    const discount = subtotal > 3000 ? Math.floor(subtotal * 0.1) : 0;
    const total = subtotal + delivery - discount;

    // 3. Optional: Save address to profile if it's new
    if (shippingName && shippingAddr) {
      const existingAddress = await prisma.address.findFirst({
        where: { userId: user.id, street: shippingAddr }
      });
      if (!existingAddress) {
        await prisma.address.create({
          data: {
            userId: user.id,
            name: shippingName,
            phone: shippingPhone || '',
            street: shippingAddr,
            city: shippingCity || '',
            state: shippingState || '',
            pincode: shippingPin || ''
          }
        });
      }
    }

    // 4. Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        status: 'PLACED',
        paymentMethod: paymentMethod,
        shippingName,
        shippingPhone,
        shippingAddr,
        shippingCity,
        shippingState,
        shippingPin,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountPrice || item.product.price,
            size: item.size,
            color: item.color
          }))
        }
      }
    });

    // 5. Empty the cart and update stock
    // We do this in a transaction to ensure data integrity
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
      ...cart.items.map(item => 
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    ]);

    // Send notifications
    import("@/lib/notifications").then(({ createNotification }) => {
      // Customer notification
      createNotification(
        user.id,
        "Order Confirmed",
        `Your order #${order.id.toString().padStart(4, '0')} has been placed successfully.`,
        "ORDER",
        `/orders/${order.id}`
      );

      // Notify vendors (find unique vendors from cart items)
      const vendorIds = new Set<number>();
      cart.items.forEach(item => {
        if (item.product.vendorId) vendorIds.add(item.product.vendorId);
      });
      vendorIds.forEach(vid => {
        createNotification(
          vid,
          "New Order Received",
          `You have a new order containing your products from order #${order.id.toString().padStart(4, '0')}.`,
          "VENDOR",
          "/seller/dashboard"
        );
      });
    }).catch(console.error);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

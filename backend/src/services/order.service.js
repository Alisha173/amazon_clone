import { prisma } from "../db/db.js";

export const placeOrder = async (addressData) => {
  // 1. Get the default user's cart and items
  const cart = await prisma.cart.findUnique({
    where: { userId: 1 }, // Assuming default User #1
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("CART_EMPTY");
  }

  // 2. Calculate the exact total based on current prices
  let totalAmount = 0;
  cart.items.forEach(item => {
    const activePrice = item.product.discountedPrice || item.product.price;
    totalAmount += parseFloat(activePrice) * item.quantity;
  });

  // 3. Execute a Prisma Transaction (All or Nothing)
  const order = await prisma.$transaction(async (tx) => {
    
    // A. Create the Order and OrderItems simultaneously
    const newOrder = await tx.order.create({
      data: {
        userId: 1,
        totalAmount: totalAmount,
        status: "PLACED",
        addressLine1: addressData.addressLine1,
        city: addressData.city,
        state: addressData.state,
        pincode: addressData.pincode,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            // We lock in the price at checkout so future price changes don't affect old orders
            price: item.product.discountedPrice || item.product.price 
          }))
        }
      }
    });

    // B. Clear the user's cart items now that the order is placed
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return newOrder;
  });

  return {
    order_id: order.id,
    status: order.status
  };
};
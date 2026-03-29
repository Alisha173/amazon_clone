import { prisma } from "../db/db.js";

export const placeOrder = async (orderData) => {
  const { addressLine1, city, state, pincode } = orderData;
  const userId = 1; // Assuming default User #1 for now

  // Convert to numbers and handle potential undefined values
  const productId = orderData.productId ? parseInt(orderData.productId) : null;
  const quantity = orderData.quantity ? parseInt(orderData.quantity) : null;

  // ==========================================
  // SCENARIO A: "BUY NOW" (Single Item)
  // ==========================================
  if (productId && quantity && quantity > 0) {
    // 1. Fetch the specific product to lock in the current price
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const activePrice = product.discountedPrice || product.price;
    const totalAmount = parseFloat(activePrice) * quantity;

    // 2. Create the order
    const order = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          userId: userId,
          totalAmount: totalAmount,
          status: "PLACED",
          addressLine1, city, state, pincode,
          items: {
            create: [{
              productId: product.id,
              quantity: quantity,
              price: activePrice
            }]
          }
        }
      });
    });

    // CRITICAL: We RETURN here. This stops the function.
    // The code below this block will NOT execute for "Buy Now".
    return { 
      order_id: order.id, 
      status: order.status, 
      type: "BUY_NOW" 
    };
  }

  // ==========================================
  // SCENARIO B: "CART CHECKOUT" (All Items)
  // ==========================================
  
  // 1. Get the default user's cart and items
  const cart = await prisma.cart.findUnique({
    where: { userId: userId },
    include: { items: { include: { product: true } } }
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("CART_EMPTY");
  }

  // 2. Calculate the total for all cart items
  let cartTotal = 0;
  cart.items.forEach(item => {
    const activePrice = item.product.discountedPrice || item.product.price;
    cartTotal += parseFloat(activePrice) * item.quantity;
  });

  // 3. Execute a Prisma Transaction (Create Order + Clear Cart)
  const cartOrder = await prisma.$transaction(async (tx) => {
    // A. Create the Order and OrderItems
    const newOrder = await tx.order.create({
      data: {
        userId: userId,
        totalAmount: cartTotal,
        status: "PLACED",
        addressLine1, city, state, pincode,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountedPrice || item.product.price 
          }))
        }
      }
    });

    // B. Clear the user's cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return newOrder;
  });

  return { 
    order_id: cartOrder.id, 
    status: cartOrder.status, 
    type: "CART_CHECKOUT" 
  };
};
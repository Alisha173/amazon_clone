import { prisma } from "../db/db.js";

// Helper function to handle the "Assume default user is logged in" requirement
const getDefaultCart = async () => {
  // Find or create User #1
  let user = await prisma.user.findUnique({ where: { id: 1 } });
  if (!user) {
    user = await prisma.user.create({
      data: { id: 1, name: "Default User", email: "default@example.com" }
    });
  }

  // Find or create their Cart
  let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: user.id } });
  }

  return cart;
};

export const getCart = async () => {
  const cart = await getDefaultCart();

  const cartData = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              discountedPrice: true,
              stock: true,
              images: { where: { isPrimary: true }, take: 1 }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  // Calculate Subtotal & Total
  let subtotal = 0;
  cartData.items.forEach(item => {
    const activePrice = item.product.discountedPrice || item.product.price;
    subtotal += parseFloat(activePrice) * item.quantity;
  });

  return {
    ...cartData,
    summary: {
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2) // Add shipping/tax logic here later if needed
    }
  };
};

export const addToCart = async (productId, quantity) => {
  const cart = await getDefaultCart();

  // Check if item is already in the cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: parseInt(productId) }
    }
  });

  if (existingItem) {
    // If it exists, just update the quantity
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parseInt(quantity) }
    });
  } else {
    // Otherwise, create a new cart item
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      }
    });
  }
};

export const updateCartItem = async (productId, quantity) => {
  const cart = await getDefaultCart();

  return await prisma.cartItem.update({
    where: {
      cartId_productId: { cartId: cart.id, productId: parseInt(productId) }
    },
    data: { quantity: parseInt(quantity) }
  });
};

export const removeCartItem = async (productId) => {
  const cart = await getDefaultCart();

  return await prisma.cartItem.delete({
    where: {
      cartId_productId: { cartId: cart.id, productId: parseInt(productId) }
    }
  });
};
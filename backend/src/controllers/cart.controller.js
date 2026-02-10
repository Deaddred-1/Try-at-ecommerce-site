import prisma from "../lib/prisma.js";

// TEMP USER (replace with auth later)
const USER_ID = "temp-user-1";

export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: USER_ID },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price:
        item.product.discountedPrice ??
        item.product.price,
      image: item.product.images[0]?.imageUrl,
      quantity: item.quantity,
      maxQuantity: item.product.quantity
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    res.status(500).json({ message: "Failed to load cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId: USER_ID }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: USER_ID }
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.quantity < 1) {
      return res.status(400).json({ message: "Out of stock" });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existing) {
      if (existing.quantity >= product.quantity) {
        return res.status(400).json({ message: "Stock limit reached" });
      }

      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + 1 }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1
        }
      });
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({
        message: "Failed to add to cart",
        error: err.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: USER_ID }
    });

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        }
      });
    } else {
      await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        },
        data: { quantity }
      });
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId: USER_ID }
    });

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

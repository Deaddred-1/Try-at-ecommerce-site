import prisma from "../lib/prisma.js";

/* --------------------------------
   GET CART
--------------------------------- */
export const getCart = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.json({ items: [] });
    }

    const userId = req.user.userId;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    const formattedItems = cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price:
        item.product.discountedPrice ??
        item.product.price,
      image: item.product.images[0]?.imageUrl,
      quantity: item.quantity,
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Failed to load cart" });
  }
};


/* --------------------------------
   ADD TO CART
--------------------------------- */
export const addToCart = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Please login to use cart",
      });
    }

    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID required",
      });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + Number(quantity),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: Number(quantity),
        },
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


/* --------------------------------
   UPDATE QUANTITY
--------------------------------- */
export const updateQuantity = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (quantity < 0) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(400).json({
        message: "Cart not found",
      });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        data: { quantity: Number(quantity) },
      });
    }

    res.json({ message: "Cart updated" });

  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({
      message: "Failed to update cart",
    });
  }
};


/* --------------------------------
   REMOVE FROM CART
--------------------------------- */
export const removeFromCart = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.json({ message: "Cart empty" });
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    res.json({ message: "Removed from cart" });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({
      message: "Failed to remove item",
    });
  }
};

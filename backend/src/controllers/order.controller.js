import prisma from "../lib/prisma.js";

/* ============================================================
   USER: CREATE ORDER (COD)
============================================================ */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address required" });
    }

    // Get user cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const price =
        item.product.discountedPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    // Create order (with items + address snapshot)
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price:
              item.product.discountedPrice ??
              item.product.price,
          }))
        },
        address: {
          create: {
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          }
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json({ orderId: order.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};


/* ============================================================
   USER: GET MY ORDERS
============================================================ */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        },
        address: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


/* ============================================================
   ADMIN: GET ALL ORDERS
============================================================ */
export const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(orders);
};


/* ============================================================
   ADMIN: UPDATE ORDER STATUS
============================================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};


/* ============================================================
   ADMIN: DELETE ORDER
============================================================ */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: "Order removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const createManualUpiOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address required" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price =
        item.product.discountedPrice ??
        item.product.price;

      return sum + price * item.quantity;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PAYMENT_PENDING_VERIFICATION",
        address: {
          create: {
            fullName: address.fullName,
            phone: address.phone,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country
          }
        },
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price:
              item.product.discountedPrice ??
              item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.json({ orderId: order.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
import prisma from "../lib/prisma.js";
import { sendEmail } from "../services/email.service.js";
import {
  orderPlacedTemplate,
  orderConfirmedTemplate,
  orderDeliveredTemplate,
  adminNewOrderTemplate,
} from "../services/templates.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address required" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price =
        item.product.discountedPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const shipping = 0;
    const total = subtotal + shipping;

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
          })),
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
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Send Emails
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Order Placed Successfully 🎉",
        html: orderPlacedTemplate(order.id, total),
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Order Received 🛒",
        html: adminNewOrderTemplate(order.id, user.email, total),
      });
    }

    res.json({ orderId: order.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    // Send status-based emails
    if (order.user?.email) {

      if (status === "CONFIRMED") {
        await sendEmail({
          to: order.user.email,
          subject: "Your Order is Confirmed ✅",
          html: orderConfirmedTemplate(order.id),
        });
      }

      if (status === "DELIVERED") {
        await sendEmail({
          to: order.user.email,
          subject: "Order Delivered 📦",
          html: orderDeliveredTemplate(order.id),
        });
      }
    }

    res.json(order);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id },
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
        items: { include: { product: true } },
      },
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
            country: address.country,
          },
        },
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price:
              item.product.discountedPrice ??
              item.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Send emails
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Order Placed Successfully 🎉",
        html: orderPlacedTemplate(order.id, total),
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Order Received 🛒",
        html: adminNewOrderTemplate(order.id, user.email, total),
      });
    }

    res.json({ orderId: order.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
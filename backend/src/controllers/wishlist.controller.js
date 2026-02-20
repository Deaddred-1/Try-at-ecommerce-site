import prisma from "../lib/prisma.js";

/* ===============================
   GET USER WISHLIST
================================ */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    res.json(wishlist);
  } catch (err) {
    console.error("GET WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

/* ===============================
   ADD TO WISHLIST
================================ */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    if (err.code === "P2002") {
      return res.json({ message: "Already in wishlist" });
    }

    console.error("ADD WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

/* ===============================
   REMOVE FROM WISHLIST
================================ */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    await prisma.wishlist.delete({
        where: {
            userId_productId: {
            userId: userId,
            productId: productId,
            },
        },
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("REMOVE WISHLIST ERROR:", err);
    res.status(500).json({ message: "Failed to remove wishlist item" });
  }
};

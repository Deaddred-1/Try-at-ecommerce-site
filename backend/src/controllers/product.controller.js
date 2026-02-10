import prisma from "../lib/prisma.js";

export const getProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      category,
      baseColor,
      inStock,
      isPremium,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const filters = {};

    //Price filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }

    if (category) filters.category = category;
    if (baseColor) filters.baseColor = baseColor;

    if (inStock === "true") {
      filters.quantity = { gt: 0 };
    }

    if (isPremium === "true") {
        filters.isPremium = true;
    }

    // Sorting
    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: {
          images: true,
          tags: { include: { tag: true } }
        },
        orderBy,
        skip,
        take: Number(limit)
      }),
      prisma.product.count({ where: filters })
    ]);

    res.json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  console.log("PARAM ID:", req.params.id);

  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        tags: { include: { tag: true } }
      }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
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
      limit = 12,
    } = req.query;

    const filters = {};

    // Price filter
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

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: {
          images: true,
          tags: { include: { tag: true } },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where: filters }),
    ]);

    res.json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        tags: { include: { tag: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discountedPrice,
      category,
      baseColor,
      description,
      quantity,
      isPremium,
      imageUrls = [],
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        discountedPrice: discountedPrice
          ? Number(discountedPrice)
          : null,
        category,
        baseColor,
        description,
        quantity: Number(quantity),
        isPremium: Boolean(isPremium),
        images: {
          create: imageUrls.map((url) => ({
            imageUrl: url,
          })),
        },
      },
      include: { images: true },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      price,
      discountedPrice,
      category,
      baseColor,
      description,
      isPremium,
      inStock,
      imageUrls,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (discountedPrice !== undefined)
      updateData.discountedPrice = discountedPrice
        ? Number(discountedPrice)
        : null;
    if (category !== undefined) updateData.category = category;
    if (baseColor !== undefined) updateData.baseColor = baseColor;
    if (description !== undefined)
      updateData.description = description;
    if (isPremium !== undefined)
      updateData.isPremium = Boolean(isPremium);
    if (inStock !== undefined)
      updateData.inStock = Boolean(inStock);

    // Only update images if provided
    if (imageUrls && Array.isArray(imageUrls)) {
      updateData.images = {
        deleteMany: {},
        create: imageUrls.map((url) => ({
          imageUrl: url,
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete related images
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

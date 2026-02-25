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

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = Number(minPrice);
      if (maxPrice) filters.price.lte = Number(maxPrice);
    }

    if (category) filters.category = category;
    if (baseColor) filters.baseColor = baseColor;
    if (inStock === "true") filters.inStock = true;
    if (isPremium === "true") filters.isPremium = true;

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: { images: true },
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
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
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
      isPremium,
      inStock,
    } = req.body;

    const imageFiles = req.files || [];

    const imageUrls = imageFiles.map(
      (file) => `/uploads/products/${file.filename}`
    );

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
        isPremium: isPremium === "true" || isPremium === true,
        inStock: inStock === "true" || inStock === true,
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
    console.error(err);
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
    } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (price) updateData.price = Number(price);
    if (discountedPrice !== undefined)
      updateData.discountedPrice = discountedPrice
        ? Number(discountedPrice)
        : null;
    if (category) updateData.category = category;
    if (baseColor) updateData.baseColor = baseColor;
    if (description) updateData.description = description;
    if (isPremium !== undefined)
      updateData.isPremium = isPremium === "true" || isPremium === true;
    if (inStock !== undefined)
      updateData.inStock = inStock === "true" || inStock === true;

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(
        (file) => `/uploads/products/${file.filename}`
      );

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
      include: { images: true },
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
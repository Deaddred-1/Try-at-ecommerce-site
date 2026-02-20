import prisma from "../lib/prisma.js";

export const getAddresses = async (req, res) => {
  const userId = req.user.userId;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });

  res.json(addresses);
};

export const addAddress = async (req, res) => {
  const userId = req.user.userId;
  const {
    fullName,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = req.body;

  if (!fullName || !phone || !line1 || !city || !state || !postalCode || !country) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      isDefault: !!isDefault,
    },
  });

  res.json(address);
};

export const deleteAddress = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  await prisma.address.deleteMany({
    where: { id, userId },
  });

  res.json({ message: "Address deleted" });
};

export const setDefaultAddress = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  res.json({ message: "Default address updated" });
};

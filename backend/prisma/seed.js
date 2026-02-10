import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.tag.deleteMany();

  const wedding = await prisma.tag.create({ data: { name: "wedding" } });
  const festive = await prisma.tag.create({ data: { name: "festive" } });
  const dailyWear = await prisma.tag.create({ data: { name: "daily-wear" } });

  const ring = await prisma.product.create({
    data: {
      name: "Classic Gold Ring",
      price: 29999,
      discountedPrice: 24999,
      isPremium: true,
      category: "ring",
      baseColor: "gold",
      description: "Elegant 18K gold ring perfect for weddings.",
      material: "18K Gold",
      weight: 4.5,
      quantity: 5,
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/400?text=Gold+Ring+1" },
          { imageUrl: "https://via.placeholder.com/400?text=Gold+Ring+2" }
        ]
      },
      tags: {
        create: [
          { tagId: wedding.id },
          { tagId: festive.id }
        ]
      }
    }
  });

  const necklace = await prisma.product.create({
    data: {
      name: "Silver Pearl Necklace",
      price: 15999,
      discountedPrice: 10000,
      category: "necklace",
      baseColor: "silver",
      description: "Minimal silver necklace with pearls.",
      material: "Sterling Silver",
      weight: 6.2,
      quantity: 3,
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/400?text=Necklace+1" }
        ]
      },
      tags: {
        create: [
          { tagId: dailyWear.id }
        ]
      }
    }
  });

  const earrings = await prisma.product.create({
    data: {
      name: "Rose Gold Earrings",
      price: 8999,
      discountedPrice: 6000,
      category: "earring",
      baseColor: "rose-gold",
      description: "Stylish rose gold earrings for everyday elegance.",
      material: "Rose Gold",
      weight: 3.1,
      quantity: 10,
      images: {
        create: [
          { imageUrl: "https://via.placeholder.com/400?text=Earrings+1" }
        ]
      },
      tags: {
        create: [
          { tagId: festive.id },
          { tagId: dailyWear.id }
        ]
      }
    }
  });

  console.log("Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
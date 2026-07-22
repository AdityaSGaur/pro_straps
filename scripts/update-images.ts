import { db } from "../src/lib/db";

const LOCAL_IMAGES = [
  '/products/chain_straps/chain_straps_black_v1.png',
  '/products/chain_straps/chain_straps_black_v2.jpg',
  '/products/chain_straps/chain_straps_silver_v1.jpg',
  '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  '/products/chain_straps/Titanium-Edition-Band-For-Apple-Watch-49464544-MM-5.webp',
  '/products/chain_straps/Whisk_11252b3307aa121bf1e4f856dd18d25adr.jpeg',
  '/products/chain_straps/Whisk_2c5f31ee9e25fa383564f044f09d9024dr.jpeg',
  '/products/chain_straps/Whisk_a21debfae9faa82bb4b4329dcb29d761dr.jpeg',
  '/products/chain_straps/f-shgcdn-645cf54f67795.webp',
  '/products/synthetic_&_rubber_straps/w1.jpg',
  '/products/synthetic_&_rubber_straps/w2.webp',
];

async function main() {
  const products = await db.product.findMany({ include: { images: true } });
  console.log(`Updating ${products.length} products with local images...`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const primaryImg = LOCAL_IMAGES[i % LOCAL_IMAGES.length];
    const secondaryImg = LOCAL_IMAGES[(i + 1) % LOCAL_IMAGES.length];

    await db.productImage.deleteMany({ where: { productId: product.id } });

    await db.productImage.create({
      data: {
        productId: product.id,
        url: primaryImg,
        alt: `${product.name} Primary View`,
        isPrimary: true,
        sortOrder: 0,
      },
    });

    await db.productImage.create({
      data: {
        productId: product.id,
        url: secondaryImg,
        alt: `${product.name} Alternate View`,
        isPrimary: false,
        sortOrder: 1,
      },
    });
  }

  console.log('Successfully updated product images in SQLite DB!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

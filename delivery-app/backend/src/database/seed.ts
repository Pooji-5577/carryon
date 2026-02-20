import { PrismaClient, VehicleType, DiscountType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME50',
        description: 'Get 50% off on your first delivery',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 50,
        maxDiscount: 100,
        minOrderAmount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true,
      },
      {
        code: 'FLAT30',
        description: 'Flat ₹30 off on all orders',
        discountType: DiscountType.FIXED,
        discountValue: 30,
        minOrderAmount: 150,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
      {
        code: 'TRUCK20',
        description: '20% off on truck deliveries',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 20,
        maxDiscount: 500,
        minOrderAmount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Promo codes created');

  // Create sample drivers
  await prisma.driver.createMany({
    data: [
      {
        phone: '+911234567890',
        name: 'Rahul Kumar',
        vehicleType: VehicleType.BIKE,
        vehicleNumber: 'DL01AB1234',
        vehicleModel: 'Honda Activa',
        licenseNumber: 'DL01-20200012345',
        isVerified: true,
        isActive: true,
        rating: 4.8,
        totalRatings: 156,
        totalDeliveries: 245,
      },
      {
        phone: '+911234567891',
        name: 'Amit Singh',
        vehicleType: VehicleType.CAR,
        vehicleNumber: 'DL02CD5678',
        vehicleModel: 'Maruti Swift',
        licenseNumber: 'DL02-20190054321',
        isVerified: true,
        isActive: true,
        rating: 4.5,
        totalRatings: 89,
        totalDeliveries: 167,
      },
      {
        phone: '+911234567892',
        name: 'Vijay Sharma',
        vehicleType: VehicleType.VAN,
        vehicleNumber: 'DL03EF9012',
        vehicleModel: 'Maruti Eeco',
        licenseNumber: 'DL03-20180098765',
        isVerified: true,
        isActive: true,
        rating: 4.9,
        totalRatings: 67,
        totalDeliveries: 98,
      },
      {
        phone: '+911234567893',
        name: 'Suresh Yadav',
        vehicleType: VehicleType.TRUCK,
        vehicleNumber: 'DL04GH3456',
        vehicleModel: 'Tata Ace',
        licenseNumber: 'DL04-20170087654',
        isVerified: true,
        isActive: true,
        rating: 4.7,
        totalRatings: 45,
        totalDeliveries: 78,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Sample drivers created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

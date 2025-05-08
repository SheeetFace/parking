import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const spots = [
  { id: 'A-01', location: 'Улица 1' },
  { id: 'A-02', location: 'Улица 2' },
  { id: 'A-03', location: 'Улица 3' },
  { id: 'A-04', location: 'Улица 4' },
  { id: 'A-05', location: 'Улица 5' },
  { id: 'B-01', location: 'Улица 6' },
  { id: 'B-02', location: 'Улица 7' },
  { id: 'B-03', location: 'Улица 8' },
  { id: 'B-04', location: 'Улица 9' },
  { id: 'B-05', location: 'Улица 10' },
  { id: 'C-01', location: 'Улица 11' },
  { id: 'C-02', location: 'Улица 12' },
  { id: 'C-03', location: 'Улица 13' },
  { id: 'C-04', location: 'Улица 14' },
  { id: 'C-05', location: 'Улица 15' },
  { id: 'D-01', location: 'Улица 16' },
  { id: 'D-02', location: 'Улица 17' },
  { id: 'D-03', location: 'Улица 18' },
  { id: 'D-04', location: 'Улица 19' },
  { id: 'D-05', location: 'Улица 20' },
  { id: 'E-01', location: 'Улица 21' },
  { id: 'E-02', location: 'Улица 22' },
  { id: 'E-03', location: 'Улица 23' },
  { id: 'E-04', location: 'Улица 24' },
];

async function main() {
  for (const spot of spots) {
    await prisma.parking_spots.upsert({
      where: { id: spot.id },
      update: {},
      create: spot,
    });
  }
  console.log('ADDED');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  .finally(() => prisma.$disconnect());

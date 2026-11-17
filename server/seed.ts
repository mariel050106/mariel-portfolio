import { prisma } from './prisma';

async function main() {
  const existingCount = await prisma.creatorPost.count();

  if (existingCount === 0) {
    await prisma.creatorPost.createMany({
      data: [
        {
          title: 'Everyday Finds Worth Sharing',
          platform: 'TikTok',
          contentType: 'Shop affiliate video',
          status: 'Published',
          views: 12800,
          description: 'A sample affiliate-style feature for useful everyday products.',
        },
        {
          title: 'A Little Behind the Scenes',
          platform: 'TikTok',
          contentType: 'Lifestyle video',
          status: 'Draft',
          views: 0,
          description: 'A sample idea for a casual creator vlog.',
        },
        {
          title: 'Pink Picks Carousel',
          platform: 'Instagram',
          contentType: 'Product showcase',
          status: 'Scheduled',
          views: 0,
          description: 'A sample product round-up ready for scheduling.',
        },
      ],
    });
    console.log('Added three sample content records.');
  } else {
    console.log(`Seed skipped: ${existingCount} content record(s) already exist.`);
  }
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

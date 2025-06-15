import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Users
  const password = await bcrypt.hash('Password123!', 10);
  const users = await prisma.user.createMany({
    data: [
      {
        id: 'admin-1',
        email: 'admin@sizanghub.org',
        displayName: 'Mang Lian',
        passwordHash: password,
        role: 'ADMIN',
        languagePreference: 'sz',
        bio: 'Sizang Pawlpi admin',
        location: 'Kalemyo',
      },
      {
        id: 'mod-1',
        email: 'mod@sizanghub.org',
        displayName: 'Niang Thian',
        passwordHash: password,
        role: 'MODERATOR',
        languagePreference: 'sz',
        bio: 'Moderator for faith topics',
        location: 'Tedim',
      },
      {
        id: 'user-1',
        email: 'lalpi@sizanghub.org',
        displayName: 'Lal Pi',
        passwordHash: password,
        role: 'USER',
        languagePreference: 'sz',
        bio: 'Youth member',
        location: 'Yangon',
      },
      {
        id: 'user-2',
        email: 'khupthang@sizanghub.org',
        displayName: 'Khup Thang',
        passwordHash: password,
        role: 'USER',
        languagePreference: 'sz',
        bio: 'Bible study enthusiast',
        location: 'Hakha',
      },
      {
        id: 'user-3',
        email: 'cinzomi@sizanghub.org',
        displayName: 'Cin Zomi',
        passwordHash: password,
        role: 'USER',
        languagePreference: 'sz',
        bio: 'Loves Sizang culture',
        location: 'Falam',
      },
    ],
    skipDuplicates: true,
  });

  // Forum Categories
  const categories = await prisma.forumCategory.createMany({
    data: [
      {
        id: 'cat-culture',
        name: 'Ngeina (Culture)',
        description: 'Sizang ngeina le thil a ummi',
        slug: 'culture',
        order: 1,
      },
      {
        id: 'cat-faith',
        name: 'Biakna (Faith)',
        description: 'Biakna le Kristian thupi',
        slug: 'faith',
        order: 2,
      },
      {
        id: 'cat-youth',
        name: 'Khangno (Youth)',
        description: 'Khangno pawlpi le thil a ummi',
        slug: 'youth',
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Groups
  await prisma.group.createMany({
    data: [
      {
        id: 'group-youth',
        name: 'Sizang Youth Global',
        description: 'Sizang khangno pawlpi tawh zohkhenna',
        slug: 'sizang-youth-global',
        privacy: 'PUBLIC',
        creatorId: 'admin-1',
      },
      {
        id: 'group-bible',
        name: 'Bible Studies',
        description: 'Kristian biakna le Bible study',
        slug: 'bible-studies',
        privacy: 'PRIVATE',
        creatorId: 'mod-1',
      },
    ],
    skipDuplicates: true,
  });

  // Resources
  await prisma.resource.createMany({
    data: [
      {
        id: 'res-1',
        title: 'Sizang Pau PDF',
        description: 'Sizang pau tawh PDF file',
        type: 'FILE',
        fileUrl: 'https://example.com/sizang-pau.pdf',
        language: 'sz',
        authorId: 'user-1',
        category: 'Ngeina (Culture)',
        tags: ['pau', 'pdf'],
      },
      {
        id: 'res-2',
        title: 'Kristian Thupi Link',
        description: 'Kristian thupi le biakna link',
        type: 'LINK',
        url: 'https://example.com/kristian-thupi',
        language: 'sz',
        authorId: 'user-2',
        category: 'Biakna (Faith)',
        tags: ['biakna', 'link'],
      },
      {
        id: 'res-3',
        title: 'Sizang Hla Audio',
        description: 'Sizang hla le hla a ummi audio',
        type: 'FILE',
        fileUrl: 'https://example.com/sizang-hla.mp3',
        language: 'sz',
        authorId: 'user-3',
        category: 'Ngeina (Culture)',
        tags: ['hla', 'audio'],
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
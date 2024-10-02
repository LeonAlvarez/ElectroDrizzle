import { db } from './client';
import { users, posts } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Insert dummy users
  const [user1, user2, user3] = await db.insert(users).values([
    { name: 'Alice Johnson' },
    { name: 'Bob Smith' },
    { name: 'Charlie Brown' },
  ]).returning();

  console.log('Inserted users:', user1, user2, user3);

  // Insert dummy posts
  await db.insert(posts).values([
    { content: 'Hello, world!', authorId: user1.id },
    { content: 'Drizzle ORM is awesome!', authorId: user1.id },
    { content: 'Learning TypeScript is fun', authorId: user2.id },
    { content: 'Building a blog application', authorId: user2.id },
    { content: 'Enjoying the weekend', authorId: user3.id },
  ]);

  console.log('Inserted posts');

  console.log('Seeding completed successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
})
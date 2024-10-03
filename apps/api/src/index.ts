import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db, schema } from 'db';
import { createUserService } from 'db/services/users';
import { usersInsertSchema } from 'db/schema/users'; // Add this import
import { zValidator } from '@hono/zod-validator';
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/api/*', cors())

const { getUsers, getUserById, createUser } = createUserService(db);

app.get('/api/users', async (c) => {
  const users = await getUsers();
  return c.json(users)
});

app.post('/api/users', zValidator('json', usersInsertSchema), async (c) => {
  const data = c.req.valid('json')
  const [user] = await createUser(data);

  return c.json(user)
});

app.get('/api/users/:id', async (c) => {
  const [user] = await getUserById(c.req.param('id'));
  return c.json(user)
});

app.get('/api/posts', async (c) => {
  const posts = await db.select().from(schema.posts);
  return c.json(posts)
});

const port = 4000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
});
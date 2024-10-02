import 'dotenv/config'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {db, schema} from 'db';
const app = new Hono()

app.get('/users', async(c) => {
  const users = await db.select().from(schema.users);
  return c.json(users)
});

app.get('/posts', async(c) => {
  const posts = await db.select().from(schema.posts);
  return c.json(posts)
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
});
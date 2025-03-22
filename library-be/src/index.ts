import { Hono } from "hono";
import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { cors } from "hono/cors";
import { booksInsertSchema, booksTable } from "./db/schema";
import { eq } from "drizzle-orm/sql";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Hono();
app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app
  .get("/books", async (c) => {
    const books = await db.select().from(booksTable);
    return c.json(books);
    return c.text("GET /books");
  })
  .post(async (c) => {
    try {
      const body: typeof booksTable.$inferInsert = booksInsertSchema.parse(
        await c.req.json(),
      );
      const book = await db.insert(booksTable).values(body).returning();
      return c.json(book);
    } catch (error: any) {
      console.error(error);
      return c.text(error.message, 500);
    }
  });

app
  .delete("/books/:id", async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const book = await db
        .delete(booksTable)
        .where(eq(booksTable.id, id))
        .returning();
      return c.json(book);
    } catch (error: any) {
      console.error(error);
      return c.text(error.message, 500);
    }
  })
  .put(async (c) => {
    try {
      const id = Number(c.req.param("id"));
      const body: typeof booksTable.$inferInsert = booksInsertSchema.parse(
        await c.req.json(),
      );
      const book = await db
        .update(booksTable)
        .set(body)
        .where(eq(booksTable.id, id))
        .returning();
      return c.json(book);
    } catch (error: any) {
      console.error(error);
      return c.text(error.message, 500);
    }
  });

export default {
  port: 3001,
  fetch: app.fetch,
};

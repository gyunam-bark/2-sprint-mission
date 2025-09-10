import { db } from '../db';
import { maps } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function getMap(id: string) {
  const result = await db.select().from(maps).where(eq(maps.id, id));
  return result[0] || null;
}

export async function createMap(name: string, data: number[][]) {
  const [inserted] = await db.insert(maps).values({ name, data }).returning();
  return inserted;
}

export async function listMaps() {
  const result = await db.select().from(maps);
  return result;
}

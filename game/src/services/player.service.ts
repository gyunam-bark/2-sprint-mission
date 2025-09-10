import { db } from '../db';
import { players } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export async function movePlayer(id: string, x: number, y: number) {
  await db
    .insert(players)
    .values({ id, x, y })
    .onConflictDoUpdate({
      target: players.id,
      set: { x, y, updatedAt: new Date() },
    });
}

export async function getNearbyPlayerList(id: string, radius: number) {
  const [me] = await db.select().from(players).where(eq(players.id, id));

  if (!me) return [];

  const result = await db.execute(
    sql`SELECT id, x, y
         FROM players
         WHERE sqrt(power(x - ${me.x}, 2) + power(y - ${me.y}, 2)) <= ${radius}`
  );

  return result.rows;
}

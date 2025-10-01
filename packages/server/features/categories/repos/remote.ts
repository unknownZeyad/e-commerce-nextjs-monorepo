import { db, DrizzleClient } from "../../../core/lib/db";
import { eq } from "drizzle-orm";
import { Category, InsertCategory, categoriesTable } from "../model";

export class CategoryRemoteRepo {
  private db: DrizzleClient;

  constructor(db: DrizzleClient) {
    this.db = db;
  }

  async getAll() {
    return await this.db.select().from(categoriesTable);
  }

  public async create(payload: Omit<InsertCategory, "path">): Promise<Category> {
    const [created] = await this.db
      .insert(categoriesTable)
      .values(payload)
      .returning();
    return created;
  } 

  public async updateById(
    id: number,
    payload: Partial<InsertCategory>
  ): Promise<Category | undefined> {
    const [updated] = await this.db
      .update(categoriesTable)
      .set(payload)
      .where(eq(categoriesTable.id, id))
      .returning();
    return updated;
  }

  public async deleteById(id: number) {
    const [deleted] = await this.db.delete(categoriesTable).where(eq(categoriesTable.id, id)).returning();
    return deleted
  }
}


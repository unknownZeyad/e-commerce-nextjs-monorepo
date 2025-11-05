import { eq, ilike, or, count, SQL, and, inArray } from "drizzle-orm";
import { Admin, adminsTable, InsertAdmin } from "./model";
import { db, DrizzleClient } from "../../core/infrastructure";

class AdminRepo {
  private db: DrizzleClient;
  private count: number = 0;

  constructor(db: DrizzleClient) {
    this.db = db;
    this.init();
  }

  private async init() {
    const [{ value }] = await this.db
      .select({ value: count() })
      .from(adminsTable);
    this.count = value;
  }

  public async getAll(
    page: number,
    limit: number,
    filters?: Partial<Admin>,
  ) {
    let whereClause: SQL | undefined;    
    if (filters && Object.keys(filters).length > 0) {
      const conditions: SQL[] = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === "") continue;

        const column = adminsTable[key as keyof Admin] as any;
        if (!column) continue;

        if (typeof value === "string") {
          conditions.push(ilike(column, `%${value}%`));
        } else {
          conditions.push(eq(column, value));
        }
      }

      if (conditions.length > 0) whereClause = and(...conditions);
    }

    const admins = await this.db
    .select()
    .from(adminsTable)
    .where(whereClause)
    .limit(limit)
    .offset((page - 1) * limit)

    const totalPages = Math.ceil(this.count / limit);

    return {
      admins,
      totalPages,
      currentPage: page,
      productsCount: this.count
    }
  }

  public async create(payload: InsertAdmin) {
    await this.db
      .insert(adminsTable)
      .values(payload)
      .returning();
    this.count += 1;
  }

  public async deleteById(id: number) {
    const [admin] = await this.db
      .delete(adminsTable)
      .where(eq(adminsTable.id, id))
      .returning();
    if (admin) this.count -= 1;
  }

  public async updateById(id: number, payload: Partial<InsertAdmin>) {
    await this.db
    .update(adminsTable)
    .set(payload)
    .where(eq(adminsTable.id, id))
    .returning();
  }

  public async getById(id: number) {
    await this.db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, id));
  }

  public async getByEmail(email: string) {
    const [admin] = await this.db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.email, email));

    return admin 
  }


  public getCount() {
    return this.count;
  }
}


export const adminRepo = new AdminRepo(db)


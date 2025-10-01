import { DrizzleClient } from "../../core/lib/db";
import { eq, like, or, count, SQL } from "drizzle-orm";
import { InsertProduct, Product, productsTable } from "./model";

class ProductServices {
  private db: DrizzleClient;
  private count: number = 0;

  constructor(db: DrizzleClient) {
    this.db = db;
    this.init();
  }

  private async init() {
    const [{ value }] = await this.db
      .select({ value: count() })
      .from(productsTable);
    this.count = value;
  }

  public async getProducts(
    page: number,
    limit: number,
    query?: string,
    filterKeys?: (keyof Product)[],
    sortKey: keyof Product = "createdDate",
    sortDir: "asc" | "desc" = "desc"
  ) {
    let whereClause: SQL | undefined;

    if (query && filterKeys?.length) {
      const conditions = filterKeys.map((key) =>
        like(productsTable[key as keyof Product], `%${query}%`)
      );
      whereClause = or(...conditions);
    }

    const orderByColumn = productsTable[sortKey as keyof typeof productsTable];
    const orderByClause =
      sortDir === "asc" ? (orderByColumn as any).asc() : (orderByColumn as any).desc();

    return this.db
      .select()
      .from(productsTable)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);
  }

  public async create(payload: InsertProduct) {
    const [product] = await this.db
      .insert(productsTable)
      .values(payload)
      .returning();
    this.count += 1;
    return product;
  }

  public async deleteById(id: number) {
    const [product] = await this.db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (product) this.count -= 1;
    return product ?? null;
  }

  public async updateById(id: number, payload: Partial<InsertProduct>) {
    const [product] = await this.db
      .update(productsTable)
      .set({ ...payload, updatedDate: new Date().toISOString() })
      .where(eq(productsTable.id, id))
      .returning();
    return product ?? null;
  }

  public async getById(id: number) {
    const [product] = await this.db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    return product ?? null;
  }

  public getCount() {
    return this.count;
  }
}

export default ProductServices;

import { db, DrizzleClient } from "../../core/lib/db";
import { eq, ilike, or, count, SQL, and, inArray } from "drizzle-orm";
import { InsertProduct, Product, productsTable } from "./model";


class ProductRepo {
  private db: DrizzleClient;
  private count: number = 0;

  constructor(db: DrizzleClient) {
    this.db = db;
    this.init();
  }

  private getSelectedCols (cols: (keyof Product)[]) {
    return cols.reduce((acc, curr) => ({
      ...acc,
      [curr]: productsTable[curr]
    }),{})
  }

  private async init() {
    const [{ value }] = await this.db
      .select({ value: count() })
      .from(productsTable);
    this.count = value;
  }

  public async getAll(
    page: number,
    limit: number,
    columns: (keyof Product)[],
    filters?: Partial<Product>,
  ) {
    let whereClause: SQL | undefined;
    const selection = this.getSelectedCols(columns)

    if (filters && Object.keys(filters).length > 0) {
      const conditions: SQL[] = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === "") continue;
        const column = productsTable[key as keyof Product] as any;
        if (!column) continue;
        if (typeof value === "string") conditions.push(ilike(column, `%${value}%`));
        else conditions.push(eq(column, value));
      }

      if (conditions.length > 0) whereClause = and(...conditions);
    }

    const products = await this.db
    .select(selection)
    .from(productsTable)
    .where(whereClause)
    .limit(limit)
    .offset((page - 1) * limit) as Product[]

    const totalPages = Math.ceil(this.count / limit);
    return {
      products,
      totalPages,
      currentPage: page,
      productsCount: this.count
    }
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

  public async getAllByIds (ids: number[], columns: (keyof Product)[]) {
    const selection = this.getSelectedCols(columns)

    return await db
    .select(selection)
    .from(productsTable)
    .where(inArray(productsTable.id, ids)) as Product[]
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


export { ProductRepo }


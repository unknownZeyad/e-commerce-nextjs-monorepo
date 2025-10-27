import { AnyClient } from "../../core/infrastructure";
import { eq, ilike, count, SQL, and, inArray } from "drizzle-orm";
import { InsertProduct, Product, productsTable } from "./model";

class ProductRepo {
  private client: AnyClient;
  static count: number = 0;

  constructor(client: AnyClient) {
    this.client = client;
    this.init();
  }

  private getSelectedCols(cols: (keyof Product)[]) {
    return cols.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: productsTable[curr],
      }),
      {}
    );
  }

  private async init() {
    const [{ value }] = await this.client
      .select({ value: count() })
      .from(productsTable);
    ProductRepo.count = value;
  }

  public async getAll(
    page: number,
    limit: number,
    columns: (keyof Product)[],
    filters?: Partial<Product>
  ) {
    let whereClause: SQL | undefined;
    const selection = this.getSelectedCols(columns);

    if (filters && Object.keys(filters).length > 0) {
      const conditions: SQL[] = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === "") continue;
        const column = productsTable[key as keyof Product] as any;
        if (!column) continue;

        if (typeof value === "string") {
          conditions.push(ilike(column, `%${value}%`));
        } else {
          conditions.push(eq(column, value));
        }
      }

      if (conditions.length > 0) {
        whereClause = and(...conditions);
      }
    }

    const products = (await this.client
      .select(selection)
      .from(productsTable)
      .where(whereClause)
      .limit(limit)
      .offset((page - 1) * limit)) as Product[];

    const totalPages = Math.ceil(ProductRepo.count / limit);

    return {
      products,
      totalPages,
      currentPage: page,
      productsCount: ProductRepo.count,
    };
  }

  public async create(payload: InsertProduct) {
    const [product] = await this.client
      .insert(productsTable)
      .values(payload)
      .returning();
    ProductRepo.count += 1;
    return product;
  }

  public async deleteById(id: number) {
    const [product] = await this.client
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (product) ProductRepo.count -= 1;
    return product ?? null;
  }

  public async updateById(id: number, payload: Partial<InsertProduct>) {
    const [product] = await this.client
      .update(productsTable)
      .set({ ...payload, updatedDate: new Date().toISOString() })
      .where(eq(productsTable.id, id))
      .returning();
    return product ?? null;
  }

  public async getAllByIds(ids: number[], columns: (keyof Product)[]) {
    const selection = this.getSelectedCols(columns);

    return (await this.client
      .select(selection)
      .from(productsTable)
      .where(inArray(productsTable.id, ids))) as Product[];
  }

  public async getById(id: number) {
    const [product] = await this.client
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    return product ?? null;
  }

  public getCount() {
    return ProductRepo.count;
  }
}

export { ProductRepo };

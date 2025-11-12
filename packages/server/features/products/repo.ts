import { AnyClient } from "../../core/infrastructure";
import { eq, ilike, count, SQL, and, inArray } from "drizzle-orm";
import { InsertProduct, Product, productsTable } from "./model";
import { variantsTable } from "./variants/model";

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
    filters?: Partial<Product>
  ) {
    let whereClause: SQL | undefined;

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
      if (conditions.length > 0) 
      whereClause = and(...conditions);
    }

    const products = await this.client
    .select({
      id: productsTable.id,
      createdAt: productsTable.createdDate,
      orderCount: productsTable.orderCount,
      brand: productsTable.brand,
      name: productsTable.name,
      price: variantsTable.price,
      quantity: variantsTable.quantity,
      discountPercentage: variantsTable.discountPercentage,
      images: variantsTable.images,
    })
    .from(productsTable)
    .innerJoin(variantsTable, eq(productsTable.mainVariantId, variantsTable.id))
    .where(whereClause)
    .limit(limit)
    .offset((page - 1) * limit)

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

  public async getWithVariants (id: number) {
    const [product] = await this.client
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) return null;

    const variantList = await this.client
      .select({
        customSku: variantsTable.customSku,
        defaultSku: variantsTable.defaultSku,
        discountPercentage: variantsTable.discountPercentage,
        disabled: variantsTable.disabled,
        images: variantsTable.images,
        quantity: variantsTable.quantity,
        price: variantsTable.price,
        id: variantsTable.id
      })
      .from(variantsTable)
      .where(eq(variantsTable.productId, id));

    return {
      ...product,
      variants: {
        options: product.variants,
        combinations: variantList
      }
    };
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

  public async getById(id: number, defaultSku?: string) {
    const [product] = await this.client
      .select({
        id: productsTable.id,
        description: productsTable.description,
        categoryFullPath: productsTable.categoryFullPath,
        variants: productsTable.variants,
        brand: productsTable.brand,
        orderCount: productsTable.orderCount,
        currentVariant: {
          id: variantsTable.id,
          price: variantsTable.price,
          images: variantsTable.images,
          name: variantsTable.name,
          discountPercentage: variantsTable.discountPercentage,
          quantity: variantsTable.quantity,
          orderCount: variantsTable.orderCount,
          defaultSku: variantsTable.defaultSku,
          disabled: variantsTable.disabled,
          customSKu: variantsTable.customSku
        },
      })
      .from(productsTable)
      .innerJoin(
        variantsTable,
        defaultSku
          ? eq(variantsTable.defaultSku, defaultSku)
          : eq(productsTable.mainVariantId, variantsTable.id)
      )
      .where(eq(productsTable.id, id))
      .limit(1);

    return product ?? null;
  }

  public getCount() {
    return ProductRepo.count;
  }
}

export { ProductRepo };

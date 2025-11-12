import { AnyClient } from "../../../core/infrastructure";
import { variantsTable } from "./model";
import { eq, inArray } from "drizzle-orm";

export type InsertVariant = typeof variantsTable.$inferInsert;
export type Variant = typeof variantsTable.$inferSelect;


class VariantRepo {
  private client: AnyClient;

  constructor(client: AnyClient) {
    this.client = client;
  }

  public async createMany(payload: InsertVariant[]) {
    const variants = await this.client
      .insert(variantsTable)
      .values(payload)
      .returning();

    return variants;
  }

  public async create(payload: InsertVariant) {
    const variants = await this.client
      .insert(variantsTable)
      .values(payload)
      .returning();

    return variants[0];
  }



  public async getByProductId(productId: number) {
    return await this.client
      .select()
      .from(variantsTable)
      .where(eq(variantsTable.productId, productId));
  }

  public async deleteBySku(sku: string) {

    const deleted = await this.client
      .delete(variantsTable)
      .where(eq(variantsTable.defaultSku, sku))
      .returning();

    return deleted;
  }

  public async updateBySku(sku: string, variant: Partial<Omit<InsertVariant,'id'>>) {
    const updated = await this.client
      .update(variantsTable)
      .set(variant)
      .where(eq(variantsTable.defaultSku, sku))
      .returning();

    return updated[0]
  }

  public async getAllByProductId (id: number) {

    const variants = await this.client
      .select()
      .from(variantsTable)
      .where(eq(variantsTable.productId, id));

    return variants;
  }
}

export { VariantRepo };

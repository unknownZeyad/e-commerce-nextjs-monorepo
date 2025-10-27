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

  public async create(payload: InsertVariant | InsertVariant[]) {
    const data = Array.isArray(payload) ? payload : [payload];
    const variants = await this.client
      .insert(variantsTable)
      .values(data)
      .returning();

    return variants;
  }


  public async getByProductId(productId: number) {
    return await this.client
      .select()
      .from(variantsTable)
      .where(eq(variantsTable.productId, productId));
  }

}

export { VariantRepo };

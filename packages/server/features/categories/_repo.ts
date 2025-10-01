import { db, DrizzleClient } from "../../core/lib/db";
import { eq } from "drizzle-orm";
import { Category, InsertCategory, categoriesTable } from "./model";

class CategoryServices {
  private db: DrizzleClient;
  private fullPathCachedMap: Map<string, Category> = new Map();
  private parentPathCachedMap: Map<string, Category[]> = new Map();
  private initialized = false;
  private initializingPromise: Promise<void> | null = null;

  constructor(db: DrizzleClient) {
    this.db = db;
  }

  private async reload() {
    const categories = await this.db.select().from(categoriesTable);

    const newFullMap = new Map<string, Category>();
    const newParentMap = new Map<string, Category[]>();

    categories.forEach((cat) => {
      const fullPath = cat.parentPath + cat.id + '/';
      newFullMap.set(fullPath, cat);
      newParentMap.set(
        cat.parentPath,
        [...(newParentMap.get(cat.parentPath) || []), cat]
      );
    });

    this.fullPathCachedMap = newFullMap;
    this.parentPathCachedMap = newParentMap;
    this.initialized = true;
  }

  private async init() {
    if (this.initialized) return;

    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    this.initializingPromise = this.reload()
      .catch((err) => {
        console.error("Failed to reload categories:", err);
        throw err;
      })
      .finally(() => {
        this.initializingPromise = null; 
      });

    return this.initializingPromise;
  }

  public async getSubCategories(parentPath?: string): Promise<Category[]> {
    await this.init();
    return this.parentPathCachedMap.get(parentPath || "") || [];
  }

  public async getCategoriesFullPath(fullPath: string): Promise<Category[]> {
    await this.init();
    const sequence: Category[] = [];
    let parentPath = ''
    fullPath.split("/").forEach((id) => {
      parentPath += `${id}/`
      const cat = this.fullPathCachedMap.get(parentPath);
      if (cat) sequence.push(cat);
    });
    return sequence;
  }

  public async create(payload: Omit<InsertCategory, "path">): Promise<Category> {
    const [created] = await this.db
      .insert(categoriesTable)
      .values(payload)
      .returning();
    await this.reload();
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
    await this.reload();
    return updated;
  }

  public async deleteById(id: number): Promise<void> {
    await this.db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    await this.reload();
  }
}


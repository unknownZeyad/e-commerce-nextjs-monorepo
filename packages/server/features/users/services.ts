import { DrizzleClient } from "@/server/core/lib/db";
import { eq, like, count } from "drizzle-orm";
import { InsertUser, User, usersTable } from "./model";

class UserServices {
  private db: DrizzleClient;
  private count: number = 0;

  constructor(db: DrizzleClient) {
    this.db = db;
    this.init();
  }

  private async init() {
    const [{ value }] = await this.db
      .select({ value: count() })
      .from(usersTable);
    this.count = value;
  }

  public async getUsers(
    page: number,
    limit: number,
    query?: string,
    filterKey?: keyof User
  ) {
    return this.db
      .select()
      .from(usersTable)
      .where(
        query && filterKey
          ? like((usersTable as any)[filterKey], `%${query}%`)
          : undefined
      )
      .limit(limit)
      .offset((page - 1) * limit);
  }

  public async getUserById(id: number) {
    return this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
  }

  public async getUserByPhone(phone: string) {
    return this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.phone, phone))
      .limit(1);
  }

  public async createUser(payload: InsertUser) {
    const [user] = await this.db
      .insert(usersTable)
      .values(payload)
      .returning();
    this.count += 1;
    return user;
  }

  public async updateUserById(id: number, payload: Partial<InsertUser>) {
    const [user] = await this.db
      .update(usersTable)
      .set(payload)
      .where(eq(usersTable.id, id))
      .returning();
    return user;
  }

  public async deleteUserById(id: number) {
    const [user] = await this.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    if (user) this.count -= 1;
    return user;
  }

  public getUsersCount() {
    return this.count;
  }
}

export default UserServices;

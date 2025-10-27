import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PgTransactionConfig } from "drizzle-orm/pg-core";
import ws from "ws";

// REQUIRED for transactions
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);

export async function transaction(
  callback: (tx: Transaction) => Promise<unknown>,
  config?: PgTransactionConfig
) {
  return db.transaction(callback, config);
}

export type DrizzleClient = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type AnyClient = DrizzleClient | Transaction;
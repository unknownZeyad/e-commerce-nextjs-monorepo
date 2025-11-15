CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(20) NOT NULL,
	"password" text NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"birth_date" varchar(20),
	"profile_image" varchar(20),
	"is_super" boolean DEFAULT false NOT NULL,
	"token_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent_id" integer,
	"created_date" timestamp DEFAULT now() NOT NULL,
	"updated_date" timestamp DEFAULT now() NOT NULL,
	"path" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"description" text NOT NULL,
	"order_count" integer DEFAULT 0 NOT NULL,
	"created_date" timestamp DEFAULT now() NOT NULL,
	"updated_date" timestamp DEFAULT now() NOT NULL,
	"category_full_path" text NOT NULL,
	"main_variant_id" integer NOT NULL,
	"variants" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"custom_sku" text,
	"default_sku" text NOT NULL,
	"order_count" integer DEFAULT 0 NOT NULL,
	"productId" integer NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"discount_percentage" real DEFAULT 0 NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"password" text NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"birth_date" varchar(20),
	"created_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_id_idx" ON "product_variants" USING btree ("productId");
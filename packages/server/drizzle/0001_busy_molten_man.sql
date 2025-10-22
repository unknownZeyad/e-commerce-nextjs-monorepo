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

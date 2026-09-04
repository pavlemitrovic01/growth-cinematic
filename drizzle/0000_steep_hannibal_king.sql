CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"consent_granted" boolean NOT NULL,
	"consent_text" text,
	"consent_version" text,
	"consent_ip" text,
	"consent_user_agent" text,
	"email_delivered" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"reset_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "rate_limit_reset_at_idx" ON "rate_limit" USING btree ("reset_at");
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_name" text NOT NULL,
	"industry" text NOT NULL,
	"employee_count" text NOT NULL,
	"security_measures" text[],
	"primary_concerns" text[],
	"contact_info" jsonb NOT NULL,
	"report_type" text NOT NULL,
	"security_score" integer,
	"matrix_data" jsonb,
	"findings" jsonb,
	"recommendations" jsonb,
	"status" text DEFAULT 'draft',
	"report_data" jsonb,
	"completed_at" timestamp,
	"risk_score" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "early_access_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text NOT NULL,
	"phone" text NOT NULL,
	"company_size" text NOT NULL,
	"industry" text NOT NULL,
	"interested_in" text[],
	"investment_level" text NOT NULL,
	"additional_info" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rasbita_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"business_id" text,
	"title" text NOT NULL,
	"incident_category" text NOT NULL,
	"overall_risk_score" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"company" jsonb NOT NULL,
	"incident" jsonb NOT NULL,
	"risk_items" jsonb NOT NULL,
	"rasbita_categories" jsonb NOT NULL,
	"financial_summary" jsonb NOT NULL,
	"dashboard" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"full_name" text,
	"email" text,
	"company_name" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "uwas" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"assessment_id" integer,
	"uwa_value" text NOT NULL,
	"identity_type" text NOT NULL,
	"machine_type" text,
	"associated_name" text,
	"component_data" jsonb,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rasbita_reports" ADD CONSTRAINT "rasbita_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uwas" ADD CONSTRAINT "uwas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uwas" ADD CONSTRAINT "uwas_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE no action ON UPDATE no action;
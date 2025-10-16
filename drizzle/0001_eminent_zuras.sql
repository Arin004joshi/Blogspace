ALTER TABLE "posts_to_categories" DROP CONSTRAINT "posts_to_categories_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "posts_to_categories" DROP CONSTRAINT "posts_to_categories_category_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "posts_to_categories" ADD CONSTRAINT "posts_to_categories_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_categories" ADD CONSTRAINT "posts_to_categories_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
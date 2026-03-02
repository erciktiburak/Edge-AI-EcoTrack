CREATE TABLE `carbon_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`day` text NOT NULL,
	`total_kwh` real NOT NULL,
	`total_carbon_kg` real NOT NULL,
	`grid_intensity` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `metrics_user_idx` ON `carbon_metrics` (`user_id`);--> statement-breakpoint
CREATE INDEX `metrics_day_idx` ON `carbon_metrics` (`day`);--> statement-breakpoint
CREATE UNIQUE INDEX `metrics_user_day_unique` ON `carbon_metrics` (`user_id`,`day`);
CREATE TABLE `carbon_analyses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`prompt` text NOT NULL,
	`recommendation` text NOT NULL,
	`savings_potential_kg` real NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `analysis_user_idx` ON `carbon_analyses` (`user_id`);--> statement-breakpoint
CREATE TABLE `energy_readings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`source` text NOT NULL,
	`kwh` real NOT NULL,
	`carbon_kg` real NOT NULL,
	`captured_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `energy_user_idx` ON `energy_readings` (`user_id`);--> statement-breakpoint
CREATE INDEX `energy_captured_idx` ON `energy_readings` (`captured_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`clerk_user_id` text NOT NULL,
	`home_country_code` text DEFAULT 'US' NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_clerk_user_id_unique` ON `users` (`clerk_user_id`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider_event_id` text NOT NULL,
	`payload` text,
	`received_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `webhook_events_provider_event_id_unique` ON `webhook_events` (`provider_event_id`);--> statement-breakpoint
CREATE INDEX `webhook_event_idx` ON `webhook_events` (`provider_event_id`);
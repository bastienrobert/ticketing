CREATE TABLE `favorites` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`starts_at` text NOT NULL,
	`venue` text,
	`address` text,
	`category` text NOT NULL,
	`price` real
);

CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`cover_url` text,
	`venue` text,
	`address` text,
	`latitude` real,
	`longitude` real
);

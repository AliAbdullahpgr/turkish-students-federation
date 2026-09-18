-- Adds the activity_posts table (admin: "Faaliyetler").
--
-- This project provisions schema with `npm run db:push`, not with a migration
-- history, so this file exists to document the change and to let you apply it
-- by hand against a database you would rather not run `push` against.
--
-- `db:push` diffs the whole schema and can propose destructive changes, so
-- review its plan before accepting it on a database holding real content.

CREATE TABLE `activity_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text DEFAULT '',
	`slug` text NOT NULL,
	`thumbnail_media_id` text,
	`category` text,
	`location` text,
	`happened_at` text DEFAULT (datetime('now')),
	`is_published` integer DEFAULT true,
	`sort_order` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text,
	FOREIGN KEY (`thumbnail_media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `activity_posts_slug_unique` ON `activity_posts` (`slug`);

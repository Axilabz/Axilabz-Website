ALTER TABLE `enquiries` ADD `company` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `budget` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `timeline` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `source_path` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `ip_hash` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `notify_status` text;--> statement-breakpoint
CREATE INDEX `enquiries_ip_created_idx` ON `enquiries` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `enquiries_email_created_idx` ON `enquiries` (`email`,`created_at`);
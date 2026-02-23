CREATE TABLE `callIns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`room` varchar(64) DEFAULT 'global',
	`country` varchar(3),
	`status` enum('queued','live','completed','cancelled') DEFAULT 'queued',
	`durationSec` int,
	`stripePaymentId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `callIns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storyId` int NOT NULL,
	`userId` int NOT NULL,
	`parentId` int,
	`content` text NOT NULL,
	`likesCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`storyId` int,
	`commentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rankings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('crime','safest','violent','fun','coldest','hottest','calmest','business') NOT NULL,
	`entityName` varchar(256) NOT NULL,
	`entityType` enum('country','state','city') NOT NULL,
	`country` varchar(3),
	`parentEntity` varchar(256),
	`flag` varchar(16),
	`rank` int NOT NULL,
	`stat` varchar(128),
	`trend` enum('up','down','same') DEFAULT 'same',
	`aiExplanation` text,
	`period` enum('today','week','month','year') DEFAULT 'today',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rankings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`externalId` varchar(256),
	`title` text NOT NULL,
	`summary` text,
	`aiSummary` text,
	`sourceUrl` varchar(2048),
	`sourceName` varchar(256),
	`imageUrl` varchar(2048),
	`category` enum('crime','trending','funny','entertainment','celebrity','gossip','weather','business') NOT NULL,
	`businessSubcategory` enum('stocks','crypto','apps','startups','products'),
	`country` varchar(3),
	`region` varchar(128),
	`city` varchar(128),
	`heatScore` int DEFAULT 0,
	`rank` int,
	`likesCount` int DEFAULT 0,
	`commentsCount` int DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`source` varchar(64) DEFAULT 'landing',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `waitlist_id` PRIMARY KEY(`id`),
	CONSTRAINT `waitlist_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','premium') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` varchar(10) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE `users` ADD `notificationPrefs` json;
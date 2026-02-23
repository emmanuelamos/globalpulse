CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(512) NOT NULL,
	`department` varchar(64) DEFAULT 'general',
	`message` text NOT NULL,
	`status` enum('new','read','replied') DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pushSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`endpoint` varchar(2048) NOT NULL,
	`p256dh` varchar(512) NOT NULL,
	`auth` varchar(256) NOT NULL,
	`categories` json,
	`countries` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pushSubscriptions_id` PRIMARY KEY(`id`)
);

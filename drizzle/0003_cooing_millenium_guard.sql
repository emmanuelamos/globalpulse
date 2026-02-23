CREATE TABLE `broadcastSegments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(64),
	`category` varchar(64),
	`durationMinutes` int DEFAULT 60,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `broadcastSegments_id` PRIMARY KEY(`id`),
	CONSTRAINT `broadcastSegments_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `broadcastTimetable` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` varchar(64) NOT NULL,
	`segmentId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startHour` int NOT NULL,
	`startMinute` int DEFAULT 0,
	`sortOrder` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `broadcastTimetable_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countryRooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryCode` varchar(3) NOT NULL,
	`countryName` varchar(128) NOT NULL,
	`flag` varchar(16) NOT NULL,
	`timezone` varchar(64) NOT NULL,
	`primaryLanguage` varchar(64) NOT NULL,
	`broadcasterMaleName` varchar(128) NOT NULL,
	`broadcasterFemaleName` varchar(128) NOT NULL,
	`broadcasterMaleEthnicity` varchar(128),
	`broadcasterFemaleEthnicity` varchar(128),
	`maxDailyCallIns` int DEFAULT 50,
	`isActive` boolean DEFAULT true,
	`demoTranscript` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `countryRooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `countryRooms_countryCode_unique` UNIQUE(`countryCode`)
);
--> statement-breakpoint
CREATE TABLE `countryVotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`countryCode` varchar(3) NOT NULL,
	`countryName` varchar(128) NOT NULL,
	`userId` int,
	`email` varchar(320),
	`notifyWhenLive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `countryVotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320),
	`feedbackType` enum('bug_report','feature_request','segment_suggestion','general') NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','reviewed','resolved') DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userCategoryPrefs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`categoryOrder` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userCategoryPrefs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `stories` MODIFY COLUMN `category` enum('crime','trending','funny','entertainment','celebrity','gossip','weather','business','sports') NOT NULL;
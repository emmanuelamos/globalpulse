ALTER TABLE `rankings` MODIFY COLUMN `type` enum('trending','crime','funny','celebrity','gossip','business','sports','hottest','coldest','calmest','safest','entertainment','weather') NOT NULL;--> statement-breakpoint
ALTER TABLE `rankings` MODIFY COLUMN `entityType` enum('country','state','city','match','show','topic','person') NOT NULL;--> statement-breakpoint
ALTER TABLE `rankings` MODIFY COLUMN `country` varchar(30);--> statement-breakpoint
ALTER TABLE `stories` MODIFY COLUMN `sourceUrl` varchar(768);--> statement-breakpoint
ALTER TABLE `stories` ADD CONSTRAINT `stories_sourceUrl_unique` UNIQUE(`sourceUrl`);
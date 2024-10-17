-- $KYAULabs: hexforged.sql,v 1.0.8 2024/10/14 15:08:38 -0700 kyau Exp $
-- ▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
-- █ ▄▄ ▄ ▄▄▄▄ ▄▄ ▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄ ▄▄▄  ▀
-- █ ██ █ ██ ▀ ██ █ ██ ▀ ██ █ ██ █ ██    ██ ▀ ██ █ █
-- ▪ ██▄█ ██▀  ▀█▄▀ ██▀  ██ █ ██▄▀ ██ ▄▄ ██▀  ██ █ ▪
-- █ ██ █ ██ █ ██ █ ██   ██ █ ██ █ ██ ▀█ ██ █ ██ █ █
-- ▄ ▀▀ ▀ ▀▀▀▀ ▀▀ ▀ ▀▀   ▀▀▀▀ ▀▀ ▀ ▀▀▀▀▀ ▀▀▀▀ ▀▀▀▀ █
-- ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
-- Hexforged SQL Database
-- Copyright (C) 2024 KYAU Labs (https://kyaulabs.com)
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as
-- published by the Free Software Foundation, either version 3 of the
-- License, or (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

--
-- Set timezone to UTC
--
SET time_zone = "+00:00";

--
-- Database: `hexforged`
--
CREATE DATABASE IF NOT EXISTS `hexforged` DEFAULT CHARACTER SET ascii COLLATE ascii_general_ci;
USE `hexforged`;

-- --------------------------------------------------------

--
-- Functions
--
DELIMITER //

CREATE FUNCTION BIN_TO_UUID(b BINARY(16))
RETURNS CHAR(36)
BEGIN
   DECLARE hexStr CHAR(32);
   SET hexStr = HEX(b);
   RETURN LOWER(CONCAT(
        SUBSTR(hexStr, 1, 8), '-',
        SUBSTR(hexStr, 9, 4), '-',
        SUBSTR(hexStr, 13, 4), '-',
        SUBSTR(hexStr, 17, 4), '-',
        SUBSTR(hexStr, 21)
    ));
END//

CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36))
RETURNS BINARY(16)
BEGIN
    RETURN UNHEX(REPLACE(uuid, '-', ''));
END//

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `activation`
--

DROP TABLE IF EXISTS `activation`;
CREATE TABLE `activation` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Activation ID',
        `uid` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'User ID',
        `token` binary(16) NOT NULL COMMENT 'Activation Token',
        -- UUID_TO_BIN(), BIN_TO_UUID()
        PRIMARY KEY (`id`),
        UNIQUE KEY `uid` (`uid`),
        UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Class ID',
        `name` varchar(64) NOT NULL COMMENT 'Class Name',
        PRIMARY KEY (`id`),
        UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
INSERT INTO `classes` VALUES (1,'bard');
INSERT INTO `classes` VALUES (2,'cleric');
INSERT INTO `classes` VALUES (3,'fighter');
INSERT INTO `classes` VALUES (4,'monk');
INSERT INTO `classes` VALUES (5,'rogue');
INSERT INTO `classes` VALUES (6,'wizard');
UNLOCK TABLES;

--
-- Table structure for table `leagues`
--

DROP TABLE IF EXISTS `leagues`;
CREATE TABLE `leagues` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'League ID',
        `name` varchar(64) NOT NULL COMMENT 'League Name',
        `token` binary(16) NOT NULL COMMENT 'League Token',
        -- UUID_TO_BIN(), BIN_TO_UUID()
        `open` timestamp NOT NULL DEFAULT NOW() COMMENT 'League Start Date & Time',
        `closed` timestamp NOT NULL DEFAULT ADD_MONTHS(NOW(),3) COMMENT 'League End Date & Time',
        `live` bit(1) NOT NULL DEFAULT 0 COMMENT 'Live Bit',
        PRIMARY KEY (`id`),
        UNIQUE KEY `name` (`name`),
        UNIQUE KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `leagues`
--

LOCK TABLES `leagues` WRITE;
INSERT INTO `leagues` VALUES (1,'Alpha',UUID_TO_BIN('177d775b-b1af-4d1c-8f08-848d0d38d28e'),'2024-10-14 02:00:00',ADD_MONTHS('2024-10-14 02:00:00',3),1);
UNLOCK TABLES;

--
-- Table structure for table `league_alpha`
--

DROP TABLE IF EXISTS `league_alpha`;
CREATE TABLE `league_alpha` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Character ID',
	`uid` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'User ID',
	`class` int(10) unsigned NOT NULL DEFAULT 1 COMMENT 'Character Class',
	`gender` enum('female', 'male') NOT NULL DEFAULT 'male' COMMENT 'Character Gender',
	`level` smallint(5) unsigned NOT NULL DEFAULT 1 COMMENT 'Character Level',
	`experience` bigint(20) unsigned NOT NULL DEFAULT 1 COMMENT 'Character Experience Points',
	`hp` mediumint(8) unsigned NOT NULL DEFAULT 25 COMMENT 'Health',
	`hp_max` mediumint(8) unsigned NOT NULL DEFAULT 25 COMMENT 'Health Max',
	`mp` mediumint(8) unsigned NOT NULL DEFAULT 10 COMMENT 'Mana',
	`mp_max` mediumint(8) unsigned NOT NULL DEFAULT 10 COMMENT 'Mana Max',
	`attack` smallint(5) unsigned NOT NULL DEFAULT 5 COMMENT 'Attack Bonus',
	`magic` smallint(5) unsigned NOT NULL DEFAULT 5 COMMENT 'Magic Attack Bonus',
	`defense` smallint(5) unsigned NOT NULL DEFAULT 5 COMMENT 'Defense Bonus',
	`map` smallint(5) unsigned NOT NULL DEFAULT 1 COMMENT 'Map',
	`pos_q` smallint(5) signed NOT NULL DEFAULT 0 COMMENT 'Hex Q Position',
	`pos_r` smallint(5) signed NOT NULL DEFAULT 0 COMMENT 'Hex R Position',
	`pos_s` smallint(5) signed NOT NULL DEFAULT 0 COMMENT 'Hex S Position',
	`speed` decimal(3,1) unsigned NOT NULL DEFAULT 0.5 COMMENT 'Movement Speed',
	`equipment` json NOT NULL DEFAULT '{"weapon": null, "alternative": null, "helmet": null, "body": null, "gloves": null, "legs": null, "boots": null}' COMMENT 'Character Equipment',
	`inventory` json NOT NULL DEFAULT '[]' COMMENT 'Character Inventory',
	PRIMARY KEY (`id`),
        CONSTRAINT `fk_uid`
                FOREIGN KEY (`uid`) REFERENCES `users` (`id`)
                ON DELETE CASCADE
                ON UPDATE RESTRICT,
        CONSTRAINT `fk_class` 
                FOREIGN KEY (`class`) REFERENCES `classes` (`id`),
	UNIQUE KEY `uid` (`uid`),
	INDEX `class` (`class`),
	INDEX `gender` (`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Table structure for table `maps`
--

DROP TABLE IF EXISTS `maps`;
CREATE TABLE `maps` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Map ID',
	`name` varchar(64) NOT NULL COMMENT 'Map Abbreviation',
	`fullname` varchar(128) NOT NULL COMMENT 'Map Name',
	`width` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'Map Width',
	`height` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'Map Height',
	PRIMARY KEY (`id`),
	INDEX `name` (`name`),
	INDEX `fullname` (`fullname`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `maps`
--

LOCK TABLES `maps` WRITE;
INSERT INTO `maps` VALUES (1,'worldmap','World Map',9,9);
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'User ID',
        `gid` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Group ID',
        `username` varchar(64) NOT NULL COMMENT 'User Name',
        `passwd` varchar(60) NOT NULL COMMENT 'Password Hash (Bcrypt)',
        `email` varchar(100) NOT NULL COMMENT 'Email Address',
        `token` binary(16) DEFAULT NULL COMMENT 'User Login Token',
        -- UUID_TO_BIN(), BIN_TO_UUID()
        `permissions` tinyint(3) DEFAULT 1 COMMENT 'User Permissions',
        `created` timestamp NOT NULL DEFAULT NOW() COMMENT 'Creation Date & Time',
        `lastlogin` timestamp NOT NULL DEFAULT NOW() COMMENT 'Date & Time of Last Login',
        -- FROM_UNIXTIME(), UNIX_TIMESTAMP()
        `lastip` int(32) unsigned NOT NULL COMMENT 'Last Login IP Address',
        -- INET_ATON('1.1.1.1'), INET_NTOA(`lastip`)
        `activated` bit(1) NOT NULL DEFAULT 0 COMMENT 'Activation User Bit',
        `disabled` bit(1) NOT NULL DEFAULT 0 COMMENT 'Disabled User Bit',
        PRIMARY KEY (`id`),
        UNIQUE KEY `username` (`username`),
        UNIQUE KEY `email` (`email`),
        INDEX `gid` (`gid`),
        INDEX `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,0,'test','$2y$10$FB5LFmlguuElwdxZamhADO7wWUnHVvk6yFwvSjNdRjP/sk8443ySG','test@test.com',NULL,1,NOW(),NOW(),INET_ATON('0.0.0.0'),1,0);
UNLOCK TABLES;

--
-- Table structure for table `users_tokens`
--

DROP TABLE IF EXISTS `users_tokens`;
CREATE TABLE `users_tokens` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Token ID',
        `selector` binary(12) NOT NULL COMMENT 'Token Selector',
        `validator` varchar(60) DEFAULT NULL COMMENT 'Token Validator Hash',
        `uid` int(12) unsigned NOT NULL COMMENT 'User ID',
        `expiry` timestamp NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 30 DAY) COMMENT 'Token Expiry Date',
        -- FROM_UNIXTIME(), UNIX_TIMESTAMP()
        PRIMARY KEY (`id`),
        UNIQUE KEY `selector` (`selector`),
        CONSTRAINT `userid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Version ID',
        `major` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'MAJOR version',
        `minor` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'MINOR version',
        `patch` tinyint(4) NOT NULL DEFAULT 0 COMMENT 'PATCH version',
        `codename` varchar(128) DEFAULT NULL COMMENT 'Version Codename',
        `datetime` timestamp NOT NULL DEFAULT NOW() COMMENT 'Release Date & Time',
        -- FROM_UNIXTIME(), UNIX_TIMESTAMP()
        PRIMARY KEY (`id`),
        UNIQUE KEY `codename` (`codename`),
        INDEX `major` (`major`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `version`
--

LOCK TABLES `version` WRITE;
INSERT INTO `version` VALUES (1,0,1,0,'dreams','2024-07-11 10:23:00');
INSERT INTO `version` VALUES (2,0,1,1,null,'2024-07-16 01:52:00');
INSERT INTO `version` VALUES (3,0,1,2,null,'2024-07-17 21:28:00');
INSERT INTO `version` VALUES (4,0,1,3,null,'2024-09-05 05:39:00');
INSERT INTO `version` VALUES (5,0,1,4,null,'2024-10-13 12:40:00');
UNLOCK TABLES;

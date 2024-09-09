-- $KYAULabs: hexforged.sql,v 1.0.6 2024/09/07 14:17:22 -0700 kyau Exp $
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
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `leagues`
--

LOCK TABLES `leagues` WRITE;
INSERT INTO `leagues` VALUES (1,'Alpha',UUID_TO_BIN('177d775b-b1af-4d1c-8f08-848d0d38d28e'),'2024-07-08 02:00:00',ADD_MONTHS('2024-07-08 02:00:00',3),1);
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
        KEY `gid` (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

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
        KEY `major` (`major`)
) ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_general_ci;

--
-- Dumping data for table `version`
--

LOCK TABLES `version` WRITE;
INSERT INTO `version` VALUES (1,0,1,0,'dreams','2024-07-11 10:23:00');
INSERT INTO `version` VALUES (2,0,1,1,null,'2024-07-16 01:52:00');
INSERT INTO `version` VALUES (3,0,1,2,null,'2024-07-17 21:28:00');
INSERT INTO `version` VALUES (4,0,1,3,null,'2024-09-05 05:39:00');
UNLOCK TABLES;

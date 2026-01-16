BEGIN TRANSACTION;

DROP TABLE `playnite_game_developer`;
DROP TABLE `playnite_game_publisher`;
DROP TABLE `playnite_game_genre`;
DROP TABLE `playnite_game_platform`;
DROP TABLE `completion_status`;
DROP TABLE `company`;
DROP TABLE `platform`;
DROP TABLE `genre`;
DROP TABLE `playnite_game`;

CREATE TABLE IF NOT EXISTS `game` (
  `Id` TEXT NOT NULL PRIMARY KEY,
  `PlayniteId` TEXT NOT NULL UNIQUE,
  `PlayniteName` TEXT,
  `PlayniteDescription` TEXT,
  `PlayniteReleaseDate` DATETIME,
  `PlaynitePlaytime` REAL NOT NULL DEFAULT 0,
  `PlayniteLastActivity` TEXT,
  `PlayniteAdded` DATETIME,
  `PlayniteInstallDirectory` TEXT,
  `PlayniteIsInstalled` BOOLEAN NOT NULL DEFAULT FALSE,
  `PlayniteBackgroundImage` TEXT,
  `PlayniteCoverImage` TEXT,
  `PlayniteIcon` TEXT,
  `PlayniteHidden` BOOLEAN NOT NULL DEFAULT FALSE,
  `PlayniteCompletionStatusId` TEXT,
  `ContentHash` TEXT NOT NULL,
  `LastUpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeletedAt` DATETIME DEFAULT NULL,
  `DeleteAfter` DATETIME DEFAULT NULL,
  `BackgroundImagePath` TEXT DEFAULT NULL,
  `CoverImagePath` TEXT DEFAULT NULL,
  `IconImagePath` TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `playnite_company` (
  `Id` TEXT NOT NULL PRIMARY KEY,
  `Name` TEXT NOT NULL,
  `LastUpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeletedAt` DATETIME DEFAULT NULL,
  `DeleteAfter` DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `playnite_completion_status` (
  `Id` TEXT PRIMARY KEY,
  `Name` TEXT NOT NULL,
  `LastUpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeletedAt` DATETIME DEFAULT NULL,
  `DeleteAfter` DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `playnite_platform` (
  `Id` TEXT NOT NULL PRIMARY KEY,
  `Name` TEXT NOT NULL,
  `SpecificationId` TEXT NOT NULL,
  `Icon` TEXT,
  `Cover` TEXT,
  `Background` TEXT,
  `LastUpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeletedAt` DATETIME DEFAULT NULL,
  `DeleteAfter` DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `playnite_genre` (
  `Id` TEXT NOT NULL PRIMARY KEY,
  `Name` TEXT NOT NULL,
  `LastUpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeletedAt` DATETIME DEFAULT NULL,
  `DeleteAfter` DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `playnite_game_developer` (
  `GameId` TEXT NOT NULL,
  `DeveloperId` TEXT NOT NULL,
  PRIMARY KEY (`GameId`, `DeveloperId`),
  FOREIGN KEY (`GameId`) REFERENCES `game`(`Id`) ON DELETE CASCADE,
  FOREIGN KEY (`DeveloperId`) REFERENCES `playnite_company`(`Id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `playnite_game_platform` (
  `GameId` TEXT NOT NULL,
  `PlatformId` TEXT NOT NULL,
  PRIMARY KEY (`GameId`, `PlatformId`),
  FOREIGN KEY (`GameId`) REFERENCES `game`(`Id`) ON DELETE CASCADE,
  FOREIGN KEY (`PlatformId`) REFERENCES `playnite_platform`(`Id`)
);

CREATE TABLE IF NOT EXISTS `playnite_game_genre` (
  `GameId` TEXT NOT NULL,
  `GenreId` TEXT NOT NULL,
  PRIMARY KEY (`GameId`, `GenreId`),
  FOREIGN KEY (`GameId`) REFERENCES `game`(`Id`) ON DELETE CASCADE,
  FOREIGN KEY (`GenreId`) REFERENCES `playnite_genre`(`Id`)
);

CREATE TABLE IF NOT EXISTS `playnite_game_publisher` (
  `GameId` TEXT NOT NULL,
  `PublisherId` TEXT NOT NULL,
  PRIMARY KEY (`GameId`, `PublisherId`),
  FOREIGN KEY (`GameId`) REFERENCES `game`(`Id`) ON DELETE CASCADE,
  FOREIGN KEY (`PublisherId`) REFERENCES `playnite_company`(`Id`)
);

COMMIT;
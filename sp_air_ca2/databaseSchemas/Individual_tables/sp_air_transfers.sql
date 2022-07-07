-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_air
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `transfers`
--

DROP TABLE IF EXISTS `transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfers` (
  `transferid` int NOT NULL AUTO_INCREMENT,
  `bookingid` int NOT NULL,
  `firstFlightId` int NOT NULL,
  `secondFlightId` int NOT NULL,
  `originAirportId` int NOT NULL,
  `transferAirportId` int NOT NULL,
  `destinationAirportId` int NOT NULL,
  PRIMARY KEY (`transferid`),
  KEY `firstFlightId_idx` (`firstFlightId`),
  KEY `secondFlightId_idx` (`secondFlightId`) /*!80000 INVISIBLE */,
  KEY `originAirport_idx` (`originAirportId`),
  KEY `originAirportNameId_idx` (`originAirportId`),
  KEY `destinationAirportNameId_idx` (`destinationAirportId`),
  KEY `bookingid_idx` (`bookingid`),
  KEY `transferAirportNameId_idx` (`transferAirportId`),
  KEY `transferFlightNameId_idx` (`transferAirportId`),
  CONSTRAINT `bookingid` FOREIGN KEY (`bookingid`) REFERENCES `bookings` (`bookingid`),
  CONSTRAINT `destinationAirportNameId` FOREIGN KEY (`destinationAirportId`) REFERENCES `airports` (`airportid`),
  CONSTRAINT `firstFlightId` FOREIGN KEY (`firstFlightId`) REFERENCES `flights` (`flightid`),
  CONSTRAINT `originAirportNameId` FOREIGN KEY (`originAirportId`) REFERENCES `airports` (`airportid`),
  CONSTRAINT `secondFlightId` FOREIGN KEY (`secondFlightId`) REFERENCES `flights` (`flightid`),
  CONSTRAINT `transferFlightNameId` FOREIGN KEY (`transferAirportId`) REFERENCES `airports` (`airportid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfers`
--

LOCK TABLES `transfers` WRITE;
/*!40000 ALTER TABLE `transfers` DISABLE KEYS */;
INSERT INTO `transfers` VALUES (1,6,5,6,1,3,4);
/*!40000 ALTER TABLE `transfers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-19 23:38:48

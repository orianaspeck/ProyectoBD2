/*
 Navicat Premium Data Transfer

 Source Server         : ProyectoBD
 Source Server Type    : MySQL
 Source Server Version : 100140
 Source Host           : localhost:3306
 Source Schema         : proyectobd

 Target Server Type    : MySQL
 Target Server Version : 100140
 File Encoding         : 65001

 Date: 08/07/2019 22:07:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for carr_prest
-- ----------------------------
DROP TABLE IF EXISTS `carr_prest`;
CREATE TABLE `carr_prest`  (
  `id_carr` int(255) NOT NULL,
  `id_pres` int(255) NOT NULL,
  PRIMARY KEY (`id_carr`, `id_pres`) USING BTREE,
  INDEX `id_prestad`(`id_pres`) USING BTREE,
  CONSTRAINT `id_carrer` FOREIGN KEY (`id_carr`) REFERENCES `carrera` (`id_carrera`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `id_prestad` FOREIGN KEY (`id_pres`) REFERENCES `prestador` (`id_prestador`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for carr_proy
-- ----------------------------
DROP TABLE IF EXISTS `carr_proy`;
CREATE TABLE `carr_proy`  (
  `id_carr_proy` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrera` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  PRIMARY KEY (`id_carr_proy`) USING BTREE,
  INDEX `id_carrera`(`id_carrera`) USING BTREE,
  INDEX `id_proyecto`(`id_proyecto`) USING BTREE,
  CONSTRAINT `carr_proy_ibfk_1` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `carr_proy_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for carr_proy_pres
-- ----------------------------
DROP TABLE IF EXISTS `carr_proy_pres`;
CREATE TABLE `carr_proy_pres`  (
  `id_carr_proy_pres` int(11) NOT NULL AUTO_INCREMENT,
  `id_carr_proy` int(11) NOT NULL,
  `id_prestador` int(11) NOT NULL,
  PRIMARY KEY (`id_carr_proy_pres`) USING BTREE,
  INDEX `id_carr_proy`(`id_carr_proy`) USING BTREE,
  INDEX `id_prestador`(`id_prestador`) USING BTREE,
  CONSTRAINT `carr_proy_pres_ibfk_1` FOREIGN KEY (`id_carr_proy`) REFERENCES `carr_proy` (`id_carr_proy`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `carr_proy_pres_ibfk_2` FOREIGN KEY (`id_prestador`) REFERENCES `prestador` (`id_prestador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for carrera
-- ----------------------------
DROP TABLE IF EXISTS `carrera`;
CREATE TABLE `carrera`  (
  `id_carrera` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id_carrera`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for encargado
-- ----------------------------
DROP TABLE IF EXISTS `encargado`;
CREATE TABLE `encargado`  (
  `id_encargado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `ci` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha_nac` date NULL DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `correo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id_encargado`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for horarios_disp
-- ----------------------------
DROP TABLE IF EXISTS `horarios_disp`;
CREATE TABLE `horarios_disp`  (
  `id_prestador` int(255) NOT NULL,
  `dia` int(5) NOT NULL,
  `hora_inicio` int(255) NOT NULL,
  `hora_fin` int(255) NOT NULL,
  PRIMARY KEY (`id_prestador`, `dia`, `hora_inicio`, `hora_fin`) USING BTREE,
  CONSTRAINT `id_prestador` FOREIGN KEY (`id_prestador`) REFERENCES `prestador` (`id_prestador`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for inst_proy
-- ----------------------------
DROP TABLE IF EXISTS `inst_proy`;
CREATE TABLE `inst_proy`  (
  `id_inst_proy` int(11) NOT NULL AUTO_INCREMENT,
  `id_institucion` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  PRIMARY KEY (`id_inst_proy`) USING BTREE,
  INDEX `id_institucion`(`id_institucion`) USING BTREE,
  INDEX `id_proyecto`(`id_proyecto`) USING BTREE,
  CONSTRAINT `inst_proy_ibfk_1` FOREIGN KEY (`id_institucion`) REFERENCES `institucion` (`id_institucion`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `inst_proy_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for institucion
-- ----------------------------
DROP TABLE IF EXISTS `institucion`;
CREATE TABLE `institucion`  (
  `id_institucion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `telefono` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `correo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `direccion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id_institucion`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for prestador
-- ----------------------------
DROP TABLE IF EXISTS `prestador`;
CREATE TABLE `prestador`  (
  `id_prestador` int(11) NOT NULL AUTO_INCREMENT,
  `ci` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha_nac` date NOT NULL,
  `horas_cumplidas` float NOT NULL,
  `id_carrera` int(11) NOT NULL,
  `preferencia` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `correo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id_prestador`) USING BTREE,
  INDEX `fk_idc`(`id_carrera`) USING BTREE,
  CONSTRAINT `fk_idc` FOREIGN KEY (`id_carrera`) REFERENCES `carrera` (`id_carrera`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for prog_prest
-- ----------------------------
DROP TABLE IF EXISTS `prog_prest`;
CREATE TABLE `prog_prest`  (
  `id_programa` int(255) NOT NULL,
  `id_prestador` int(255) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_programa`, `id_prestador`) USING BTREE,
  INDEX `id_presta`(`id_prestador`) USING BTREE,
  CONSTRAINT `id_presta` FOREIGN KEY (`id_prestador`) REFERENCES `prestador` (`id_prestador`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `id_progr` FOREIGN KEY (`id_programa`) REFERENCES `programa` (`id_programa`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for programa
-- ----------------------------
DROP TABLE IF EXISTS `programa`;
CREATE TABLE `programa`  (
  `id_programa` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_programa`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for prom_proy
-- ----------------------------
DROP TABLE IF EXISTS `prom_proy`;
CREATE TABLE `prom_proy`  (
  `id_prom_proy` int(11) NOT NULL AUTO_INCREMENT,
  `id_programa` int(11) NOT NULL,
  `id_proyecto` int(11) NOT NULL,
  PRIMARY KEY (`id_prom_proy`) USING BTREE,
  INDEX `id_programa`(`id_programa`) USING BTREE,
  INDEX `id_proyecto`(`id_proyecto`) USING BTREE,
  CONSTRAINT `prom_proy_ibfk_1` FOREIGN KEY (`id_programa`) REFERENCES `programa` (`id_programa`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `prom_proy_ibfk_2` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for proyecto
-- ----------------------------
DROP TABLE IF EXISTS `proyecto`;
CREATE TABLE `proyecto`  (
  `id_proyecto` int(11) NOT NULL AUTO_INCREMENT,
  `id_encargado` int(11) NOT NULL,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_proyecto`) USING BTREE,
  INDEX `id_encargado`(`id_encargado`) USING BTREE,
  CONSTRAINT `proyecto_ibfk_1` FOREIGN KEY (`id_encargado`) REFERENCES `encargado` (`id_encargado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for reportes_horas
-- ----------------------------
DROP TABLE IF EXISTS `reportes_horas`;
CREATE TABLE `reportes_horas`  (
  `id_prestador` int(255) NOT NULL,
  `fecha` date NOT NULL,
  `hora_entrada` time(4) NOT NULL,
  `hora_salida` time(4) NOT NULL,
  `horas_servicio` int(255) NOT NULL,
  `id_proyecto` int(255) NOT NULL,
  `observacion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `id_institucion` int(255) NOT NULL,
  PRIMARY KEY (`id_prestador`, `fecha`, `hora_entrada`) USING BTREE,
  INDEX `id_proy`(`id_proyecto`) USING BTREE,
  INDEX `id_inst`(`id_institucion`) USING BTREE,
  CONSTRAINT `id_inst` FOREIGN KEY (`id_institucion`) REFERENCES `institucion` (`id_institucion`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `id_prest` FOREIGN KEY (`id_prestador`) REFERENCES `prestador` (`id_prestador`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `id_proy` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;

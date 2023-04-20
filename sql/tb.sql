CREATE TABLE `INFO` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `line_number` varchar(255) NOT NULL,
  `location` varchar(255),
  `from` text NOT NULL,
  `to` text NOT NULL,
  `drawing_number` text NOT NULL,
  `service` varchar(255),
  `material` varchar(255),
  `inservice_date` date NOT NULL,
  `pipe_size` decimal NOT NULL,
  `original_thickness` decimal NOT NULL,
  `stress` int NOT NULL,
  `joint_efficiency` int NOT NULL,
  `ca` int NOT NULL,
  `design_life` int NOT NULL,
  `design_pressure` int NOT NULL,
  `operating_pressure` int NOT NULL,
  `design_temperature` decimal NOT NULL,
  `operating_temperature` decimal NOT NULL,
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `line_number_UNIQUE` (`line_number`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `CML` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `line_number_id` int(10) NOT NULL,
  `cml_number` int NOT NULL,
  `cml_description` text,
  `actual_outside_diameter` decimal,
  `design_thickness` decimal,
  `structural_thickness` decimal,
  `required_thickness` decimal,
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_INFO_CML` (`line_number_id`),
  CONSTRAINT `fk_INFO_CML` FOREIGN KEY (`line_number_id`) REFERENCES `INFO` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `TEST_POINT` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cml_number_id` int(10) NOT NULL,
  `tp_number` int NOT NULL,
  `tp_description` int NOT NULL,
  `note` text,
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_CML_TP` (`cml_number_id`),
  CONSTRAINT `fk_CML_TP` FOREIGN KEY (`cml_number_id`) REFERENCES `CML` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `THICKNESS` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `tp_number_id` int(10) NOT NULL,
  `inspection_date` date NOT NULL,
  `actual_thickness` decimal NOT NULL,
  `added_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_TP_THICKNESS` (`tp_number_id`),
  CONSTRAINT `fk_TP_THICKNESS` FOREIGN KEY (`tp_number_id`) REFERENCES `TEST_POINT` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO INFO (id, line_number, location, from, to, drawing_number, service, material, inservice_date, pipe_size, original_thickness, stress, joint_efficiency, ca, design_life, design_pressure, operating_pressure, design_temperature, operating_temperature,)
VALUES  (1, "6-PL-J4N-01007", "Dacon A", "BLACK STARTCOOLED WELL FLUID FROM MDPP", "TEST SEPARATOR,V-0111", "MDA-D-B-26001-1-0-Rev00-2011", "PL", "Duplex Stainless Steel", "2020/1/1", 6, 7.1, 20000, 1, 3, 25, 1015, 327, 140, 45)
        (2, "6-PL-J4N-01110", "", "", "", "", "", "", "//", , , , , , , , , , )
        (3, "", "", "", "", "", "", "", "//", , , , , , , , , , )
        (4, "", "", "", "", "", "", "", "//", , , , , , , , , , )
        (5, "", "", "", "", "", "", "", "//", , , , , , , , , , );

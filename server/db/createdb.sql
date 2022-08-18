/* Creating database */
DROP SCHEMA IF EXISTS `FRS`;
CREATE SCHEMA `FRS`;
USE `FRS`;

/* Creating admin table */
CREATE TABLE `FRS`.`admin` (
  `name` VARCHAR(20) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`email`));
  
/* Creating admin logs table */
CREATE TABLE `FRS`.`admin_log` (
  `change_id` INT NOT NULL AUTO_INCREMENT,
  `change_by` VARCHAR(20) NOT NULL,
  `change_on` VARCHAR(36) NOT NULL,
  `change_type` VARCHAR(6) NOT NULL,
  `change_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`change_id`));

/* Creating user table */
CREATE TABLE `FRS`.`user` (
  `user_id` VARCHAR(36) NOT NULL,
  `base_img` VARCHAR(100) NOT NULL,
  `img_ext` VARCHAR(10) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `mob_no` VARCHAR(20) NOT NULL UNIQUE,
  `gender` VARCHAR(1) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `department` VARCHAR(45) NOT NULL,
  `captured_count` INT NOT NULL DEFAULT 0,
  `date_created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `last_modified_by` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`user_id`));
  
/* Creating user change log table */
CREATE TABLE `FRS`.`user_change_log` (
  `change_id` INT NOT NULL AUTO_INCREMENT,
  `change_by` VARCHAR(45) NOT NULL,
  `change_type` VARCHAR(6) NOT NULL,
  `change_timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `user_id` VARCHAR(45) NOT NULL,
  `base_img` VARCHAR(45) NOT NULL,
  `img_ext` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `mob_no` VARCHAR(45) NOT NULL,
  `gender` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `department` VARCHAR(45) NOT NULL,
  `date_created` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`change_id`));

/* Creating user capture log table */
CREATE TABLE `FRS`.`user_capture_log` (
  `capture_id` INT NOT NULL AUTO_INCREMENT,
  `img_name` VARCHAR(50) NOT NULL,
  `recognition_status` VARCHAR(5) NOT NULL,
  `user_id` VARCHAR(36) NULL,
  `in/out` VARCHAR(3) NOT NULL,
  `date_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`capture_id`));

/* Trigger for creating log on insert user */
DELIMITER $$
CREATE TRIGGER `create_log_on_insert` AFTER INSERT ON `user` FOR EACH ROW BEGIN
	INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`)
    VALUE (NEW.`last_modified_by`, NEW.`user_id`, "INSERT");
    INSERT INTO `user_change_log` (`change_by`, `change_type`, `user_id`, `base_img`, `img_ext`, `name`, `mob_no`, `gender`, `city`, `department`, `date_created`) 
    VALUE (NEW.`last_modified_by`, "INSERT", NEW.`user_id`, NEW.`base_img`, NEW.`img_ext`, NEW.`name`, NEW.`mob_no`, NEW.`gender`, NEW.`city`, NEW.`department`, NEW.`date_created`);
END$$
DELIMITER ;

/* Trigger for creating log on update user */
DELIMITER $$
CREATE TRIGGER `create_log_on_update` AFTER UPDATE ON `user` FOR EACH ROW BEGIN
    IF (NEW.`base_img` != OLD.`base_img` OR NEW.`name` != OLD.`name` OR NEW.`mob_no` != OLD.`mob_no` OR NEW.`gender` != OLD.`gender` OR NEW.`city` != OLD.`city` OR NEW.`department` != OLD.`department`) THEN
        INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`)
		VALUE (NEW.`last_modified_by`, NEW.`user_id`, "UPDATE");
        INSERT INTO `user_change_log` (`change_by`, `change_type`, `user_id`, `base_img`, `img_ext`, `name`, `mob_no`, `gender`, `city`, `department`, `date_created`) 
		VALUE (NEW.`last_modified_by`, "UPDATE", NEW.`user_id`, NEW.`base_img`, NEW.`img_ext`, NEW.`name`, NEW.`mob_no`, NEW.`gender`, NEW.`city`, NEW.`department`, NEW.`date_created`);
    END IF;
END$$
DELIMITER ;

/* Trigger for creating log on delete user */
DELIMITER $$
CREATE TRIGGER `FRS`.`create_log_on_delete` AFTER DELETE ON `user` FOR EACH ROW
BEGIN
	INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`)
	VALUE (OLD.`last_modified_by`, OLD.`user_id`, "DELETE");
	INSERT INTO `user_change_log` (`change_by`, `change_type`, `user_id`, `base_img`, `img_ext`, `name`, `mob_no`, `gender`, `city`, `department`, `date_created`) 
	VALUE (OLD.`last_modified_by`, "DELETE", OLD.`user_id`, OLD.`base_img`, OLD.`img_ext`, OLD.`name`, OLD.`mob_no`, OLD.`gender`, OLD.`city`, OLD.`department`, OLD.`date_created`);
END$$
DELIMITER ;

/* Get user view */
CREATE 
VIEW `FRS`.`get_user` AS
    SELECT 
		`FRS`.`user`.`user_id` AS `user_id`,
        `FRS`.`user`.`base_img` AS `base_img`,
        `FRS`.`user`.`name` AS `name`,
        `FRS`.`user`.`mob_no` AS `mob_no`,
        `FRS`.`user`.`gender` AS `gender`,
        `FRS`.`user`.`city` AS `city`,
        `FRS`.`user`.`department` AS `department`,
        `FRS`.`user`.`date_created` AS `date_created`
    FROM
        `FRS`.`user`;

/* Delete user procedure */
DELIMITER $$
CREATE PROCEDURE `delete_user`(IN usr_id VARCHAR(36), IN last_modifier VARCHAR(20))
BEGIN
	UPDATE `user` SET `last_modified_by` = last_modifier WHERE `user_id` = usr_id;
	SELECT `base_img` FROM `user` WHERE `user_id` = usr_id;
    DELETE FROM `user` WHERE `user_id` = usr_id;
END$$
DELIMITER ;

/* Increment capture_count procedure */
DELIMITER $$
CREATE PROCEDURE `record_user_capture` (IN img VARCHAR(50), IN usr_id VARCHAR(36), IN in_sts VARCHAR(3))
BEGIN
	IF (usr_id != "unrecognized") THEN
		UPDATE `user` SET `captured_count` = `captured_count`+1 WHERE `user_id` = usr_id;
    INSERT INTO `user_capture_log` (`img_name`, `recognition_status`, `user_id`, `in/out`) 
    VALUES (img, "TRUE", usr_id, in_sts);
    SELECT * FROM `get_user` WHERE `user_id` = usr_id;
  END IF;
  IF (usr_id = "unrecognized") THEN
		INSERT INTO `user_capture_log` (`img_name`, `recognition_status`, `in/out`) 
    VALUES (img, "FALSE", in_sts);
  END IF;
END$$
DELIMITER ;

/* Get user capture log procedure */
DELIMITER $$
CREATE PROCEDURE `get_capture_log` ()
BEGIN
  SELECT uc.`user_id`, ut.`name`, uc.`in/out`, uc.`date_time`
  FROM `user_capture_log` uc
  JOIN `user` ut
  ON ut.`user_id` = uc.`user_id`
  WHERE uc.`recognition_status` = "TRUE"
  ORDER BY `date_time` DESC
  LIMIT 20;
END$$
DELIMITER ;

/* Get admin log procedure */
DELIMITER $$
CREATE PROCEDURE `get_admin_log` (IN admin_name VARCHAR(20))
BEGIN
	SELECT `change_on`, `change_type`, `change_time`
	FROM `admin_log`
	WHERE `change_by` = admin_name
	ORDER BY `change_time` DESC
	LIMIT 20;
END$$
DELIMITER ;

/* Inserting dummy admin values */
INSERT INTO `FRS`.`admin` (`name`, `email`, `password`) VALUES ('vedansh', 'vedansh@gmail.com', 'password');
INSERT INTO `FRS`.`admin` (`name`, `email`, `password`) VALUES ('sumedh', 'sumedh@gmail.com', 'sudu_1000');
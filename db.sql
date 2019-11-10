
CREATE TABLE IF NOT EXISTS `orc_transactions_tab` (
	id INT(11) NOT NULL AUTO_INCREMENT,
	timestamp INT NOT NULL,
	name VARCHAR(100) NOT NULL,
	value FLOAT NOT NULL,
	currency CHAR(3) NOT NULL,
	channel_source VARCHAR(32) NOT NULL,
	channel_destination VARCHAR(32) NOT NULL,
	category VARCHAR(32) NOT NULL,
	description TEXT,
	PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4;


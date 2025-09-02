CREATE TABLE tracker.users (
	id BIGINT auto_increment PRIMARY KEY NOT NULL,
	username varchar(100) NOT NULL,
	password VARCHAR(255) NOT NULL,
	age INT NOT NULL,
	height INT NULL,
	weight INT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tracker.`data` (
	id BIGINT auto_increment PRIMARY KEY NOT NULL,
	user_id BIGINT NOT NULL,
	heartrate INT NOT NULL,
	steps INT NOT NULL,
	distance INT NOT NULL,
	gforce DOUBLE NOT NULL,
	INDEX idx_user_id (user_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;



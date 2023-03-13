CREATE TABLE calendars(
  id INT PRIMARY KEY AUTO_INCREMENT,
  friendly_name VARCHAR(100) NOT NULL,
  organization VARCHAR(100) NOT NULL,
  project_id INT NOT NULL,
  start_date_field VARCHAR(100) NOT NULL,
  end_date_field VARCHAR(100) NOT NULL,
  use_milestones BOOLEAN
);

CREATE TABLE displayed_calendars(
  user_id BIGINT PRIMARY KEY,
  calendars JSON NOT NULL
);
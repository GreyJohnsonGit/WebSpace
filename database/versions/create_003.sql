BEGIN;

CREATE TABLE UserAccount (
  user_id 
    UUID 
    NOT NULL 
    PRIMARY KEY 
    DEFAULT gen_random_uuid(),
  user_name 
    VARCHAR(50) 
    UNIQUE 
    NOT NULL,
  user_email 
    VARCHAR(100) 
    UNIQUE 
    NOT NULL,
  user_created_at 
    TIMESTAMP 
    NOT NULL 
    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Weight (
  user_id 
    UUID 
    NOT NULL 
    REFERENCES UserAccount(user_id),
  weight_kg
    DECIMAL(5,2) 
    NOT NULL,
  weight_recorded_at 
    TIMESTAMP 
    NOT NULL 
    DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
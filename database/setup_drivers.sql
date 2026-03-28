-- Drivers Table
-- Stores details specific to bus drivers

CREATE TABLE IF NOT EXISTS drivers (
    id INT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    license_number TEXT UNIQUE,
    phone_number TEXT,
    experience_years INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO drivers (id, user_id, full_name, phone_number, license_number, is_active) VALUES
(1, 2, 'Unni Suresh', '9876543200', 'KL35 4258', TRUE),
(2, 3, 'Unni Jose', '9876543201', 'KL22 7967', TRUE),
(3, 4, 'Syam Kurian', '9876543202', 'KL23 3481', TRUE),
(4, 5, 'Unni Pillai', '9876543203', 'KL54 5322', TRUE),
(5, 6, 'Vishnu Varghese', '9876543204', 'KL28 3598', TRUE),
(6, 7, 'Akhil Santhosh', '9876543205', 'KL39 1863', TRUE),
(7, 8, 'Jijo Prakash', '9876543206', 'KL61 4518', TRUE);

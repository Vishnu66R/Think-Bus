-- Buses Table
-- Manages the fleet of buses.
-- Capacity is crucial for AI constraints to ensure rerouted buses can fit all students.

CREATE TABLE IF NOT EXISTS buses (
    id INT PRIMARY KEY,
    registration_number TEXT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    driver_id INT REFERENCES drivers(id) ON DELETE SET NULL,
    route_id INT REFERENCES routes(id) ON DELETE SET NULL,
    
    -- Status can be: 'Active', 'Maintenance', 'Breakdown', 'Idle'
    status TEXT DEFAULT 'Idle',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO buses (id, registration_number, capacity, driver_id, route_id, status) VALUES
(1, 'KL-02-B-2001', 50, 1, 1, 'Active'),
(2, 'KL-02-B-2002', 50, 2, 2, 'Active'),
(3, 'KL-02-B-2003', 50, 3, 3, 'Active'),
(4, 'KL-02-B-2004', 50, 4, 4, 'Active'),
(5, 'KL-02-B-2005', 50, 5, 5, 'Active'),
(6, 'KL-02-B-2006', 50, 6, 6, 'Active'),
(7, 'KL-02-B-2007', 50, 7, 7, 'Active');

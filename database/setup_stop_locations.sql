-- Stop Locations Table
-- Stores latitude and longitude for each route stop.
-- Foreign key links to the route_stops table.

CREATE TABLE IF NOT EXISTS stop_locations (
    id SERIAL PRIMARY KEY,
    route_stop_id INT NOT NULL REFERENCES route_stops(id) ON DELETE CASCADE,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    UNIQUE(route_stop_id)
);

-- Template insert for Bus 1 (Route 1) stops
-- Please replace the 0.0 values with the actual coordinates you have.
INSERT INTO stop_locations (route_stop_id, latitude, longitude) VALUES
(1, 0.0, 0.0),  -- Karunagapally
(2, 0.0, 0.0),  -- Kuttivattom
(3, 0.0, 0.0),  -- Edapallykkotta
(4, 0.0, 0.0),  -- Sangaramangalam
(5, 0.0, 0.0),  -- Chavara
(6, 0.0, 0.0),  -- Neendakara
(7, 0.0, 0.0),  -- Shakthikulangara
(8, 0.0, 0.0),  -- Kavanadu
(9, 0.0, 0.0),  -- Kadavoor
(10, 0.0, 0.0); -- College Of Engineering Perumon

-- Route Stops Table
-- Stores details of stops along different bus routes

CREATE TABLE IF NOT EXISTS route_stops (
    id INT PRIMARY KEY,
    route_id INT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_name TEXT NOT NULL,
    stop_order INT NOT NULL,
    time_from_start_mins INT
);

-- Dump data for route stops (Matching the 7 existing routes)
-- Assuming the base stop is 0 mins and the college is 75 mins away.
INSERT INTO route_stops (id, route_id, stop_name, stop_order, time_from_start_mins) VALUES
(1, 1, 'Karunagapally', 1, 0),
(2,1,'Kuttivattom',2,10),
(3,1,'Edapallykkotta',3,20),
(4,1,'Sangaramangalam',4,30),
(5,1,'Chavara',5,40),
(6,1,'Neendakara',6,50),
(7,1,'Shakthikulangara',7,60),
(8,1,'Kavanadu',8,70),
(9,1,'Kadavoor',9,80),
(10,1,'College Of Engineering Perumon',10,90),

(11,2,'Neduvathoor',1,0),
(12,2,'Ambalathumkala',2,10),
(13,2,'Ezhukone',3,20),
(14,2,'Perumpuzha',4,30),
(15,2,'Keralapuram',5,40),
(16,2,'College Of Engineering Perumon',6,50),

(17,3,'Kottarakkara',1,0),
(18,3,'Kottarakkara Railway Station',2,10),
(19,3,'Nedumpayikkulam',3,20),
(20,3,'Kundara',4,30),
(21,3,'Vellimon',5,40),
(22,3,'Cherumoodu',6,50),
(23,3,'College Of Engineering Perumon',7,60),

(24,4,'Kottiyam',1,0),
(25,4,'Umayanalloor',2,10),
(26,4,'Pallimukku',3,20),
(27,4,'Polayathodu',4,30),
(28,4,'Chinnakkada',5,40),
(29,4,'College Of Engineering Perumon',6,50),

(30,5,'Paravoor',1,0),
(31,5,'Nedumgolam',2,10),
(32,5,'Thirumukku',3,20),
(33,5,'Kallumthazham',4,30),
(34,5,'Moonamkutty',5,40),
(35,5,'Karicode',6,50),
(36,5,'Chandanathope',7,60),
(37,5,'College Of Engineering Perumon',8,70),

(38,6,'Mevarom',1,0),
(39,6,'Thattamala',2,10),
(40,6,'Madanada',3,20),
(41,6,'Collge Junction',4,30),
(42,6,'Kollam Railway Station',5,40),
(43,6,'High School Junction',6,50),
(44,6,'College Of Engineering Perumon',7,60),

(45,7,'Paripally',1,0),
(46,7,'Kalluvathukal',2,10),
(47,7,'Karamcode',3,20),
(48,7,'Chathannoor',4,30),
(49,7,'Ithikkara',5,40),
(50,7,'Palathara',6,50),
(51,7,'SN Public School',7,60),
(52,7,'Mangad',8,70),
(53,7,'Anchalumoodu',9,80),
(54,7,'College Of Engineering Perumon',10,90);
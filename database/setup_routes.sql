CREATE TABLE IF NOT EXISTS routes (
    id INT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    start_point TEXT NOT NULL,
    end_point TEXT NOT NULL,
    estimated_duration_minutes INT
);

INSERT INTO routes (id, name, start_point, end_point, estimated_duration_minutes) VALUES
(1, 'Karunagapally', 'Karunagapally', 'College Of Engineering Perumon', 45),
(2, 'Paravoor', 'Paravoor', 'College Of Engineering Perumon', 60),
(3, 'Mevarom', 'Mevarom', 'College Of Engineering Perumon', 60),
(4, 'Kottiyam', 'Kottiyam', 'College Of Engineering Perumon', 60),
(5, 'Paripally','Paripally','College Of Engineering Perumon', 60),
(6, 'Kottarakkara','Kottarakkara','College Of Engineering Perumon', 60),
(7, 'Cheerankavu','Cheerankavu','College Of Engineering Perumon', 60);

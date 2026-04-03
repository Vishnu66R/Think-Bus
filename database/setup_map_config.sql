-- Map Configuration Table
-- Stores configuration for the interactive maps.

CREATE TABLE IF NOT EXISTS map_config (
    id SERIAL PRIMARY KEY,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL
);

-- Insert OSM Tile URL and other settings
INSERT INTO map_config (config_key, config_value) VALUES
('osm_tile_url', 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
('default_zoom', '13');

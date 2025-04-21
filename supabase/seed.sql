-- Insert sample games
INSERT INTO games (title, description, image_url) VALUES
('Cyber Odyssey 2077', 'A futuristic open-world adventure', '/games/cyber-odyssey.jpg'),
('Racing Champions', 'High-speed racing simulation', '/games/racing-champions.jpg'),
('Fantasy Quest IX', 'Epic fantasy role-playing game', '/games/fantasy-quest.jpg'),
('Space Explorers', 'Explore the vast universe', '/games/space-explorers.jpg'),
('Zombie Survival', 'Survive in a post-apocalyptic world', '/games/zombie-survival.jpg');

-- Insert sample achievements
INSERT INTO achievements (game_id, title, description, points) VALUES
((SELECT id FROM games WHERE title = 'Cyber Odyssey 2077'), 'First Steps', 'Complete the tutorial', 10),
((SELECT id FROM games WHERE title = 'Cyber Odyssey 2077'), 'Master Hacker', 'Hack 100 terminals', 50),
((SELECT id FROM games WHERE title = 'Racing Champions'), 'Speed Demon', 'Win a race without crashing', 30),
((SELECT id FROM games WHERE title = 'Fantasy Quest IX'), 'Dragon Slayer', 'Defeat the first boss', 20),
((SELECT id FROM games WHERE title = 'Space Explorers'), 'Explorer', 'Discover 5 new planets', 40); 
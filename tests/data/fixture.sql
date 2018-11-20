START TRANSACTION;

REPLACE INTO user (id, login, name, email, password, role) VALUES
(1000, 'administrator', 'administrator', 'administrator@example.com', MD5('administrator'), 'administrator'),
(1001, 'member', 'member', 'member@example.com', MD5('member'), 'member');

REPLACE INTO tag (id, name) VALUES
(2000, 'Test tag 2000');

REPLACE INTO resource (id, name, description) VALUES
(3000, 'Test resource 3000', 'No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 'Test resource 3001', 'Crom, I have never prayed to you before. I have no tongue for it. No one, not even you, will remember if we were good men or bad. Why we fought, or why we died. All that matters is that two stood against many. That''s what''s important! Valor pleases you, Crom... so grant me one request. Grant me revenge! And if you do not listen, then the HELL with you!');

REPLACE INTO booking (id, responsible_id, start_date, end_date, estimated_end_date, destination, start_comment) VALUE
(4000, 1001, '2018-01-01 14:15:00', '2018-01-01 18:21:43', '18h', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4001, 1001, '2018-01-02 13:32:51', NULL, 'tonight', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.');

REPLACE INTO booking_resource (booking_id, resource_id) VALUES
(4000, 3000),
(4000, 3001),
(4001, 3000);

COMMIT;

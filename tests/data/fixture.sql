START TRANSACTION;

REPLACE INTO user (id, login, name, email, password, role) VALUES
(1000, 'administrator', 'administrator', 'administrator@example.com', MD5('administrator'), 'administrator'),
(1001, 'responsible', 'responsible', 'responsible@example.com', MD5('responsible'), 'responsible'),
(1002, 'member', 'member', 'member@example.com', MD5('member'), 'member'),
(1003, 'booking_only', 'booking_only', 'booking_only@example.com', MD5('booking_only'), 'booking_only'),
(1004, 'inactive', 'inactive', 'inactive@example.com', MD5('inactive'), 'inactive');

REPLACE INTO license (id, name) VALUES
(2000, 'Test license 2000');

REPLACE INTO bookable_type (id, name) VALUES
(6000, 'Lorem ipsum'),
(6001, 'Fusce Cursus'),
(6002, 'Tristique Euismod Pellentesque');

REPLACE INTO bookable (id, periodic_price, initial_price, type_id, name, code, booking_type, description) VALUES
(3000, 0, 0, 6000, 'Test bookable self-approved  3000 (free)', 'a', 'self_approved', 'Pour carnet de sortie. No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 0, 0, 6001, 'Test bookable self-approved  3001 (free)', 'b', 'self_approved', 'Pour carnet de sortie. Crom, I have never prayed to you before. I have no tongue for it. No one, not even you, will remember if we were good men or bad. Why we fought, or why we died. All that matters is that two stood against many. That''s what''s important! Valor pleases you, Crom... so grant me one request. Grant me revenge! And if you do not listen, then the HELL with you!'),
(3002, 10, 0, 6002, 'Test bookable admin-approved  3002 (periodic)', 'c', 'admin_approved', 'Pour demande de stockage. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3003, 10, 0, 6000, 'Test bookable admin-only  3003 (Cashier 18, periodic)', 'd', 'admin_only', 'Casier XYZ. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3004, 20, 0, 6001, 'Test bookable admin-only  3004 (NTF, periodic)', 'e', 'admin_only', 'Service supplémentaire. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3005, 0, 10, 6002, 'Test bookable mandatory  3005 (initial)', 'f', 'mandatory', 'Pour adhésion et cotisation. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3006, 90, 0, 6000, 'Test bookable mandatory 3006 (periodic)', 'g', 'mandatory', 'Pour adhésion et cotisation. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.');

REPLACE INTO booking (id, responsible_id, start_date, end_date, estimated_end_date, destination, start_comment) VALUE
(4000, 1002, '2018-01-01 14:15:00', '2018-01-01 18:21:43', '18h', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4001, 1002, '2018-01-02 13:32:51', NULL, 'tonight', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.');

REPLACE INTO booking_bookable (booking_id, bookable_id) VALUES
(4000, 3000),
(4000, 3001),
(4001, 3000);

REPLACE INTO image (id, bookable_id, filename, width, height) VALUES
(5000, 3000,'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',  500, 374);

COMMIT;

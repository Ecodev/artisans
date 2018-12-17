START TRANSACTION;

REPLACE INTO user (id, login, name, email, password, role) VALUES
(1000, 'administrator', 'administrator', 'administrator@example.com', MD5('administrator'), 'administrator'),
(1001, 'responsible', 'responsible', 'responsible@example.com', MD5('responsible'), 'responsible'),
(1002, 'member', 'member', 'member@example.com', MD5('member'), 'member'),
(1003, 'booking_only', 'booking_only', 'booking_only@example.com', MD5('booking_only'), 'booking_only'),
(1004, 'inactive', 'inactive', 'inactive@example.com', MD5('inactive'), 'inactive');

REPLACE INTO license (id, name) VALUES
(2000, 'Test license 2000');

REPLACE INTO bookable_tag (id, name) VALUES
(6000, 'SUP'),
(6001, 'Planche'),
(6002, 'Canoë'),
(6003, 'Kayak'),
(6004, 'Aviron'),
(6005, 'Voile légère'),
(6006, 'Voile lestée'),
(6007, 'Service'),
(6008, 'Stockage'),
(6009, 'Armoire'),
(6010, 'Casier'),
(6011, 'Flotteurs');

REPLACE INTO bookable (id, periodic_price, initial_price, name, code, booking_type, description) VALUES
(3000, 0, 0, 'Stand up S28 (3000, self-approved, free)', 'S28', 'self_approved', 'Pour carnet de sortie. No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 0, 0, 'Canoe C32 (3001, self-approved, free)', 'C32', 'self_approved', 'Pour carnet de sortie. Crom, I have never prayed to you before. I have no tongue for it. No one, not even you, will remember if we were good men or bad. Why we fought, or why we died. All that matters is that two stood against many. That''s what''s important! Valor pleases you, Crom... so grant me one request. Grant me revenge! And if you do not listen, then the HELL with you!'),
(3002, 10, 0, 'Casier virtuel (3002, admin-approved, periodic)', 'casier', 'admin_approved', 'Pour demande de stockage. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3003, 10, 0, 'Casier 1012 (3003, admin-only, periodic)', 'CA1012', 'admin_only', 'Casier XYZ. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3004, 20, 0, 'Membre NFT (3004, admin-approved, periodic)', 'e', 'admin_approved', 'Service supplémentaire. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3005, 0, 10, 'Frais ouverture (3005, mandatory, initial)', 'f', 'mandatory', 'Pour adhésion et cotisation. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3006, 90, 0, 'Cotisation (3006, mandatory, periodic)', 'g', 'mandatory', 'Pour adhésion et cotisation. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.');

REPLACE INTO bookable_tag_bookable (bookable_tag_id, bookable_id) VALUES
(6000, 3000),
(6002, 3001),
(6008, 3002),
(6010, 3002),
(6008, 3003),
(6010, 3003),
(6007, 3004),
(6007, 3005),
(6007, 3006);

-- Bookings for self-approved bookables
REPLACE INTO booking (id, responsible_id, status, start_date, end_date, estimated_end_date, destination, start_comment) VALUE
(4000, 1002, 'booked', '2018-01-01 14:15:00', '2018-01-01 18:21:43', '18h', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4001, 1002, 'booked', '2018-01-02 13:32:51', NULL, 'tonight', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.');

-- Bookings for admin-approved or mandatory bookables
REPLACE INTO booking (id, responsible_id, status) VALUE
(4003, 1002, 'application'),
(4004, 1002, 'booked'),
(4005, 1002, 'booked'),
(4006, 1002, 'application');

REPLACE INTO booking_bookable (booking_id, bookable_id) VALUES
(4000, 3000),
(4000, 3001),
(4001, 3000),
(4003, 3002),
(4004, 3003),
(4005, 3006),
(4006, 3004);

REPLACE INTO image (id, bookable_id, filename, width, height) VALUES
(5000, 3000,'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',  500, 374);

COMMIT;

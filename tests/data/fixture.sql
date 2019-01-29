START TRANSACTION;

REPLACE INTO user (id, owner_id, login, first_name, last_name, email, password, role, status, welcome_session_date, family_relationship) VALUES
(1000, NULL, 'administrator', 'Admin', 'Istrator', 'administrator@example.com', MD5('administrator'), 'administrator', 'active', '2018-01-01 12:00:00', 'householder'),
(1001, NULL, 'responsible', 'Respon', 'Sable', 'responsible@example.com', MD5('responsible'), 'responsible', 'active', '2018-01-01 12:00:00', 'householder'),
(1002, NULL, 'member', 'Active', 'Member', 'member@example.com', MD5('member'), 'member', 'active', '2018-01-01 12:00:00', 'householder'),
(1003, NULL, 'bookingonly', 'Booking', 'Only', 'bookingonly@example.com', MD5('bookingonly'), 'booking_only', 'active', '2018-01-01 12:00:00', 'householder'),
(1004, NULL, 'newmember', 'New', 'User', 'newmember@example.com', MD5('newmember'), 'member', 'new', NULL, 'householder'),
(1005, NULL, 'inactive', 'Inactive', 'Member', 'inactive@example.com', MD5('inactive'), 'member', 'inactive', '2018-01-01 12:00:00', 'householder'),
(1006, NULL, 'archived', 'Archived', 'Member', 'archived@example.com', MD5('archived'), 'member', 'archived', '2018-01-01 12:00:00', 'householder'),
(1007, 1002, 'individual', 'Conj', 'Oint', 'conjoint@example.com', MD5('conjoint'), 'individual', 'active', '2018-01-01 12:00:00', 'partner'),
(1008, 1002, 'son', 'Fi', 'ls', 'fils@example.com', MD5('fils'), 'individual', 'active', '2018-01-01 12:00:00', 'child'),
(1009, 1002, 'daughter', 'Fi', 'Lle', 'fille@example.com', MD5('fille'), 'individual', 'active' ,'2018-01-01 12:00:00', 'child'),
(1010, NULL, 'voiliermember', 'Voilier', 'Member', 'voiliermember@example.com', MD5('voiliermember'), 'member', 'archived', '2018-01-01 12:00:00', 'householder'),
(1011, 1010, 'voilierfamily', 'Voilier', 'Family', 'voilierfamily@example.com', MD5('voilierfamily'), 'individual', 'active', '2018-01-01 12:00:00', 'partner');

REPLACE INTO account (id, owner_id, balance, iban, name) VALUES
(6000, 1002, 100.00, 'CH1909000000177406305', 'Compte de membre'),
(6001, NULL, 1000.00, 'CH0980241000004014701', 'Raiffeisen'),
(6002, NULL, 500.00, NULL, 'Caisse'),
(6003, 1007, 50.00, 'CH1909000000177396305', 'Compte de conjoint');

REPLACE INTO license (id, name) VALUES
(2000, 'Voilier');

REPLACE INTO license_user (license_id, user_id) VALUES
(2000, 1010);

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
(3000, 0, 0, 'Stand up S28 (3000, carnet de sortie, occupé)', 'S1', 'self_approved', 'Pour carnet de sortie. No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 0, 0, 'Canoe C32 (3001, carnet de sortie, libre)', 'C1', 'self_approved', 'Pour carnet de sortie. Crom, I have never prayed to you before. I have no tongue for it. No one, not even you, will remember if we were good men or bad. Why we fought, or why we died. All that matters is that two stood against many. That''s what''s important! Valor pleases you, Crom... so grant me one request. Grant me revenge! And if you do not listen, then the HELL with you!'),
(3002, 10, 0, 'Casier virtuel (3002, sur demande, periodic)', 'casier', 'admin_approved', 'Pour demande de stockage. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3003, 10, 0, 'Casier 1012 (3003, inventaire / spécifique admin, periodic)', 'CA1012', 'admin_only', 'Casier XYZ. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3004, 20, 0, 'Membre NFT (3004, inventaire / spécifique admin, periodic)', 'e', 'admin_approved', 'Service supplémentaire. Sed posuere consectetur est at lobortis. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(3005, 0, 10, 'Frais ouverture (3005, obligatoire, initial)', 'f', 'mandatory', 'Pour adhésion et cotisation. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.'),
(3006, 90, 0, 'Cotisation (3006, obligatoire, periodic)', 'g', 'mandatory', 'Pour adhésion et cotisation. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.'),
(3007, 90, 0, 'Voilier 1 (3007, carnet de sortie, avec certification, occupé)', 'V1', 'self_approved', 'Pour carnet de sortie, mais avec certification'),
(3008, 90, 0, 'Voilier 2 (3008, carnet de sortie, avec certification, libre)', 'V2', 'self_approved', 'Pour carnet de sortie, mais avec certification');

REPLACE INTO license_bookable (license_id, bookable_id) VALUES
(2000, 3007),
(2000, 3008);

REPLACE INTO bookable_tag_bookable (bookable_tag_id, bookable_id) VALUES
(6000, 3000),
(6002, 3001),
(6008, 3002),
(6010, 3002),
(6008, 3003),
(6010, 3003),
(6007, 3004),
(6007, 3005),
(6007, 3006),
(6005, 3007),
(6005, 3008);

REPLACE INTO booking (id, owner_id, status, start_date, end_date, estimated_end_date, destination, start_comment) VALUE
(4000, 1002, 'booked', '2018-01-01 14:15:00', '2018-01-01 18:21:43', '18h', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4001, 1002, 'booked', '2018-01-02 13:32:51', NULL, 'tonight', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4003, 1002, 'application', '2018-01-02 13:32:51', NULL, '', '', ''),
(4004, 1002, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4005, 1002, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4006, 1002, 'application', '2018-01-02 13:32:51', NULL, '', '', ''),
(4007, 1005, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4008, NULL, 'booked', '2018-01-02 13:32:51', NULL, 'Never', 'Land', 'Curabitur blandit tempus porttitor. Maecenas sed diam eget risus varius blandit sit amet non magna.'),
(4009, 1002, 'booked', '2018-01-02 13:32:51', NULL, 'Yesterday', 'Narnia', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'),
(4010, NULL, 'booked', '2018-01-02 13:32:51', NULL, 'Judgment day', 'Skynet bunker', 'Nulla vitae elit libero, a pharetra augue.'),
(4011, NULL, 'booked', '2018-01-02 13:32:51', NULL, '21 oct 2015', 'Twin Pines Mall', 'Where we go we don''t need roads');

-- Only a bookable by booking
REPLACE INTO booking_bookable (booking_id, bookable_id) VALUES
(4000, 3000),
(4001, 3000),
(4003, 3002),
(4004, 3003),
(4005, 3006),
(4006, 3004),
(4007, 3006),
(4008, 3000),
(4011, 3007);


REPLACE INTO image (id, bookable_id, filename, width, height) VALUES
(5000, 3000,'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg',  500, 374);

REPLACE INTO expense_claim (id, owner_id, amount, status, name, description, remarks) VALUES
(7000, 1002, 200.00, 'new', 'achats Jumbo', 'outils pour voilier', ''),
(7001, 1002, 100.00, 'processed', 'flyers', 'Cighelio', '');

REPLACE INTO transaction (id, transactionDate, amount, account_id, name, remarks, bookable_id) VALUES
(8000, '2017-12-06', 360.00, 6001, 'Cours nautique', 'Cours 190', NULL),
(8001, '2017-12-29', -11.15, 6001, 'Comité', 'Photocopies', NULL),
(8002, '2017-03-10', 90, 6001, 'Cotisation 2017', '', NULL),
(8003, '2017-03-15', 90, 6002, 'Cotisation 2017', '', NULL),
(8004, '2017-04-01', 100.00, 6000, 'Remboursement flyers', '', NULL),
(8005, '2018-03-01', -50.00, 6002, 'Location casier 1012', '', 3003);

REPLACE INTO accounting_document (id, expense_claim_id, filename) VALUES
(9000, 7000,'dw4jV3zYSPsqE2CB8BcP8ABD0.pdf');

REPLACE INTO category (id, name) VALUES
(10000, 'Administratif'),
(10001, 'Voilier'),
(10002, 'SUP'),
(10003, 'NFT'),
(10004, 'Entretien');

REPLACE INTO category_category (category_source, category_target) VALUES
(10001, 10004),
(10002, 10004),
(10003, 10004);

REPLACE INTO message (id, creator_id, owner_id, recipient_id, type, date_sent, subject, body) VALUES
(11001, 1000, 1000, 1002, 'monthly_reminder', '2019-01-01 12:00:00', 'Avertissement de crédit négatif', 'Bonjour, nous vous informons que votre compte Ichtus présente un solde négatif'),
(11002, 1001, 1001, 1005, 'yearly_reminder', '2019-03-01 12:00:00', 'Nettoyage local', 'Bonjour, nous vous invitons à venir nous aider pour le nettoyage de printemps du local');

REPLACE INTO user_tag (id, creator_id, owner_id, name, color) VALUES
(12000, 1000, 1000, 'Moniteur voile', '#0000FF'),
(12001, 1000, 1000, 'Moniteur SUP', '#FF0000');

REPLACE INTO user_tag_user (user_tag_id, user_id) VALUES
(12000, 1008),
(12001, 1009);

REPLACE INTO bookable_metadata (id, bookable_id, name, value) VALUES
(13000, 3000, 'Largeur', '1405 mm'),
(13001, 3000, 'Hauteur', '160 5mm');



COMMIT;

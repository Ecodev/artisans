START TRANSACTION;

REPLACE INTO product_tag (id, name) VALUES
(6000, 'Mobilité'),
(6001, 'Technologie'),
(6002, 'Jardinage');

REPLACE INTO image (id, filename, width, height, mime) VALUES
(5000, 'garden.jpg', 792, 528, 'image/jpeg'),
(5001, 'transport.jpg', 840, 466, 'image/jpeg'),
(5002, 'train.jpg', 832, 468, 'image/jpeg');

REPLACE INTO product (id, is_active, image_id, price_per_unit_chf, price_per_unit_eur, name, code, type, description) VALUES
(3000, 1, 5000, 1000, 1500, 'Revue printemps 2019', '2019-01', 'both', 'Des article intéressants sur le jardinage assisté par ordinateur'),
(3001, 1, 5001, 1000, 1500, 'Revue été 2019', '2019-02', 'both', 'La révolution des transports en commun'),
(3002, 1, 5002, 500, 550, 'Article individuel', '2019-02-02', 'digital', 'Pourquoi le train est-il plus rapide ?');

REPLACE INTO product_tag_product (product_tag_id, product_id) VALUES
(6002, 3000),
(6001, 3000),
(6000, 3001),
(6001, 3001),
(6000, 3002);

REPLACE INTO subscription (id, is_active, image_id, price_per_unit_chf, price_per_unit_eur, name, code, type, description) VALUES
(19000, 1, NULL, 5500, 4000, 'Abonnement standard papier', 'abo-papier', 'paper', 'Aenean lacinia bibendum nulla sed consectetur.Aenean lacinia bibendum nulla sed consectetur.'),
(19001, 1, NULL, 8000, 5000, 'Abonnement standard numérique', 'abo-web', 'digital', 'Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'),
(19002, 1, NULL, 10500, 7000, 'Abonnement standard papier et numérique', 'abo-web-papier', 'both', 'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(19003, 1, NULL, 6500, 4500, 'Abonnement institutionnel papier', 'abo-pro-papier', 'paper', 'Aenean lacinia bibendum nulla sed consectetur.Aenean lacinia bibendum nulla sed consectetur.'),
(19004, 1, NULL, 16000, 10000, 'Abonnement institutionnel numérique', 'abo-pro-web', 'digital', 'Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'),
(19005, 1, NULL, 18500, 12000, 'Abonnement institutionnel papier et numérique', 'abo-pro-web-papier', 'both', 'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

REPLACE INTO message (id, creator_id, owner_id, recipient_id, type, date_sent, email, subject, body) VALUES
(11001, 1000, 1000, 1002, 'balance', '2019-01-01 12:00:00','member@example.com', 'Avertissement de crédit négatif', 'Bonjour, nous vous informons que votre compte Artisans présente un solde négatif'),
(11002, 1001, 1001, 1001, 'reset_password', NULL,'inactive@example.com', 'Nettoyage local', 'Bonjour, nous vous invitons à venir nous aider pour le nettoyage de printemps du local');

REPLACE INTO user_tag (id, creator_id, owner_id, name, color) VALUES
(12000, 1000, 1000, 'User tag 0', '#cD4A50'),
(12001, 1000, 1000, 'User tag 1', '#A4CE4C');

REPLACE INTO user_tag_user (user_tag_id, user_id) VALUES
(12000, 1001),
(12001, 1001),
(12001, 1002);

REPLACE INTO `order` (id, owner_id, creator_id, creation_date, balance_chf, balance_eur, status) VALUES
(16000, 1002, 1002, '2019-04-24', 2500, NULL, 'pending'),
(16001, 1003, 1003, '2019-04-25', NULL, 1000, 'pending'),
(16002, 1000, 1000, '2019-04-25', 1500, NULL, 'pending'),
(16003, 1000, 1000, '2019-05-19', 12000, NULL, 'validated');

REPLACE INTO order_line (id, owner_id, order_id, product_id, subscription_id, creation_date, quantity, type, balance_chf, balance_eur, name) VALUES
(17000, 1002, 16000, 3000, NULL, '2019-04-24', 2, 'paper', 1000, NULL, 'Revue printemps 2019'),
(17001, 1002, 16000, 3002, NULL, '2019-04-24', 1, 'digital', 1500, NULL, 'Article individuel'),
(17002, 1002, 16001, 3001, NULL, '2019-04-24', 1, 'digital', NULL, 1000, 'Revue été 2019'),
(17003, 1000, 16002, 3000, NULL, '2019-05-15', 2, 'paper', 1000, NULL, 'Revue printemps 2019'),
(17004, 1000, 16003, NULL, 19000, '2019-05-19', 1, 'paper', 12000, NULL, 'Abonnement standard papier');

REPLACE INTO file (id, product_id, owner_id, filename, mime) VALUES
(9000, 3001,  1002, 'dw4jV3zYSPsqE2CB8BcP8ABD0.pdf', 'application/pdf'),
(9001, 3002,  1000, '4k123pkopvs3iDFV948abcde.pdf', 'application/pdf');

REPLACE INTO `configuration` (id, `key`, `value`) VALUES
(18000, 'home-block-1-title', 'Titre bloc 1'),
(18001, 'home-block-1-description', 'Description bloc 1 Donec ullamcorper nulla non metus auctor fringilla. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.'),
(18002, 'home-block-1-button-label', 'Label bouton bloc 1'),
(18003, 'home-block-1-button-link', '/panier'),
(18004, 'home-block-2-title', 'Titre bloc 2'),
(18005, 'home-block-2-description', 'Description bloc 2 Donec ullamcorper nulla non metus auctor fringilla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'),
(18006, 'home-block-2-button-label', 'Label bouton bloc 2'),
(18007, 'home-block-2-button-link', '/larevuedurable/numeros'),
(18008, 'home-block-3-title', 'Titre bloc 3'),
(18009, 'home-block-3-description', 'Description bloc 3 Donec ullamcorper nulla non metus auctor fringilla. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.'),
(18010, 'home-block-3-button-label', 'Label bouton bloc 3'),
(18011, 'home-block-3-button-link', '/larevuedurable/articles');

REPLACE INTO session (id, start_date, name, region, locality, street, dates) VALUES
(20000, '2032-02-01', 'Lausanne 2032-2', 'Vaud', 'Lausanne', 'Rue de lausanne 1', '["1er fevrier", "14 février", "31 février"]'),
(20001, '2032-03-01', 'Lausanne 2032-3', 'Vaud', 'Lausanne', 'Rue de lausanne 2', '["1er mars", "14 mars", "31 mars"]'),
(20002, '2032-04-01', 'Lausanne 2032-4', 'Vaud', 'Lausanne', 'Rue de lausanne 3', '["1er avril", "14 avril", "31 avril"]'),
(20003, '2032-03-01', 'Lutry 2032-3', 'Vaud', 'Lutry', 'Rue de lutry 1', '["2 mars", "15 mars", "30 mars"]'),
(20004, '2032-05-01', 'Lutry 2032-4', 'Vaud', 'Lutry', 'Rue de lutry 2', '["2 mai", "15 mai", "30 mai"]'),
(20005, '2032-03-01', 'Neuchâtel 2032-3', 'Neuchâtel', 'Neuchâtel', 'Rue de neuchâtel 2', '["2 mars", "15 mars", "30 mars"]'),
(20006, '2016-04-01', 'Lausanne 2016-4 (passé)', 'Vaud', 'Lausanne', 'Rue de lausanne 3', '["1er avril", "14 avril", "31 avril"]');

COMMIT;

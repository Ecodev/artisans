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

REPLACE INTO `order` (id, owner_id, creator_id, creation_date) VALUES
(16000, 1002, 1002, '2019-04-24'),
(16001, 1003, 1003, '2019-04-25');

REPLACE INTO order_line (id, owner_id, order_id, product_id, creation_date, quantity, type, name) VALUES
(17000, 1002, 16000, 3000, '2019-04-24', 2, 'paper', 'Revue printemps 2019'),
(17001, 1002, 16000, 3002, '2019-04-24', 1, 'digital', 'Article individuel'),
(17002, 1002, 16001, 3001, '2019-04-24', 1, 'digital', 'Revue été 2019');

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


COMMIT;

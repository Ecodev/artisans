START TRANSACTION;

SET sql_mode = 'STRICT_TRANS_TABLES';

REPLACE INTO product_tag (id, name) VALUES
(6000, 'Agriculture et alimentation'),
(6001, 'Biodiversité'),
(6002, 'Energie et climat'),
(6003, 'Construction, ville et urbanisme'),
(6004, 'Mobilité'),
(6005, 'Consommation et déchets'),
(6007, 'Ressources et équilibres de la Terre'),
(6008, 'Démographie'),
(6009, 'Economie'),
(6010, 'Démocratie et gouvernance'),
(6011, 'Education'),
(6012, 'Philosophie et culture'),
(6013, 'Santé');

REPLACE INTO image (id, filename, width, height, mime) VALUES
(5000, 'revue61.jpg', 1358, 1831, 'image/jpeg'),
(5001, 'revue62.jpg', 1830, 2480, 'image/jpeg'),
(5002, 'train.jpg', 832, 468, 'image/jpeg');

REPLACE INTO file (id, owner_id, filename, mime) VALUES
(9000, 1002, 'dw4jV3zYSPsqE2CB8BcP8ABD0.pdf', 'application/pdf'),
(9001, 1000, '4k123pkopvs3iDFV948abcde.pdf', 'application/pdf'),
(9002, 1000, 'non-existing-1.pdf', 'application/pdf'),
(9003, 1000, 'non-existing-2.pdf', 'application/pdf');

REPLACE INTO product (id, is_active, image_id, file_id, price_per_unit_chf, price_per_unit_eur, code, review_number, review_id, type, release_date, name, description) VALUES
(3000, 1, 5000, NULL, 1500, 1000, '2019-01', 61, NULL, 'both', '2019-06-01', 'Sobriété et liberté : à la recherche d''un équilibre', 'Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Maecenas faucibus mollis interdum.Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.'),
(3001, 1, 5001, 9000, 1500, 1000, '2019-06', 62, NULL,'both', '2019-12-01', 'Habitat : le pouvoir de la participation', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec sed odio dui. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.'),
(3002, 1, 5002, 9001, 500, 450, '2019-02-01a', NULL, 3000, 'digital', NULL, 'Article numérique 1', 'Curabitur blandit tempus porttitor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.'),
(3003, 1, NULL, 9002, 500, 450, '2019-02-01b', NULL, 3000, 'digital', NULL, 'Article numérique 2', 'Nullam id dolor id nibh ultricies vehicula ut id elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis.'),
(3004, 1, NULL, 9003, 0, 0, '2019-02-01c', NULL, 3000, 'digital', NULL, 'Article numérique 3', 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras justo odio, dapibus ac facilisis in, egestas eget quam.'),
(3005, 1, NULL, NULL, 500, 450, '2019-02-01d', NULL, 3000, 'digital', NULL, 'Article numérique 4', 'Cras mattis consectetur purus sit amet fermentum. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec id elit non mi porta gravida at eget metus.'),
(3006, 1, NULL, NULL, 500, 450, '2019-02-01e', NULL, 3000, 'digital', NULL, 'Article numérique 5', 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.'),
(3007, 1, NULL, NULL, 500, 450, '2019-02-01f', NULL, 3000, 'digital', NULL, 'Article numérique 6', 'Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus auctor fringilla. Maecenas faucibus mollis interdum. Donec sed odio dui. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.'),
(3008, 1, NULL, NULL, 500, 450, '2019-02-01g', NULL, 3000, 'digital', NULL, 'Article numérique 7', 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum. Maecenas sed diam eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.'),
(3009, 1, NULL, NULL, 500, 450, '2019-02-01h', NULL, 3000, 'digital', NULL, 'Article numérique 8', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Curabitur blandit tempus porttitor. Nullam id dolor id nibh ultricies vehicula ut id elit.'),
(3010, 0, NULL, NULL, 500, 450, '2019-02-01i', NULL, 3000, 'digital', NULL, 'Article numérique 9', 'Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum.'),
(3011, 1, NULL, NULL, 1000, 1500, 'coti', NULL, NULL, 'other', NULL, 'Cotisation','Soutenez un super projet, et accessoirement, la planète !');

REPLACE INTO product_tag_product (product_tag_id, product_id) VALUES
(6001, 3002),
(6002, 3003),
(6000, 3004),
(6001, 3005),
(6002, 3006),
(6000, 3007),
(6001, 3008),
(6002, 3009),
(6000, 3010);

REPLACE INTO subscription (id, is_active, image_id, price_per_unit_chf, price_per_unit_eur, name, code, type, description) VALUES
(19000, 1, NULL, 5500, 4000, 'Abonnement standard papier', 'abo-papier', 'paper', 'Aenean lacinia bibendum nulla sed consectetur.Aenean lacinia bibendum nulla sed consectetur.'),
(19001, 1, NULL, 8000, 5000, 'Abonnement standard numérique', 'abo-web', 'digital', 'Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'),
(19002, 1, NULL, 10500, 7000, 'Abonnement standard papier et numérique', 'abo-web-papier', 'both', 'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(19003, 1, NULL, 6500, 4500, 'Abonnement institutionnel papier', 'abo-pro-papier', 'paper', 'Aenean lacinia bibendum nulla sed consectetur.Aenean lacinia bibendum nulla sed consectetur.'),
(19004, 1, NULL, 16000, 10000, 'Abonnement institutionnel numérique', 'abo-pro-web', 'digital', 'Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.'),
(19005, 1, NULL, 18500, 12000, 'Abonnement institutionnel papier et numérique', 'abo-pro-web-papier', 'both', 'Donec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

REPLACE INTO message (id, creator_id, owner_id, recipient_id, type, date_sent, email, subject, body) VALUES
(11001, 1000, 1000, 1002, 'updated_user', '2019-01-01 12:00:00','member@example.com', 'Modification', 'Bonjour, un utilisateur a été modifié'),
(11002, 1001, 1001, 1001, 'reset_password', NULL,'inactive@example.com', 'Nettoyage local', 'Bonjour, nous vous invitons à venir nous aider pour le nettoyage de printemps du local');

REPLACE INTO `order` (id, owner_id, creator_id, creation_date, status, payment_method) VALUES
(16000, 1002, 1002, '2019-04-24', 'validated', 'bvr'),
(16001, 1003, 1003, '2019-04-25', 'pending', 'datatrans'),
(16002, 1000, 1000, '2019-04-25', 'validated', 'datatrans'),
(16003, 1000, 1000, '2019-05-19', 'pending', 'ebanking'),
(16004, 1002, 1003, '2021-01-25', 'pending', 'datatrans');

REPLACE INTO order_line (id, owner_id, order_id, product_id, subscription_id, creation_date, quantity, type, balance_chf, balance_eur, name) VALUES
(17000, 1002, 16000, 3000, NULL, '2019-04-24', 2, 'paper', 1500, 0, 'Sobriété et liberté : à la recherche d''un équilibre'),
(17001, 1002, 16000, 3002, NULL, '2019-04-24', 1, 'digital', 500, 0, 'Article numérique 1'),
(17002, 1003, 16001, 3001, NULL, '2019-04-24', 1, 'digital', 1000, 0, 'Habitat : le pouvoir de la participation'),
(17003, 1000, 16002, 3000, NULL, '2019-05-15', 1, 'digital', 0, 1000, 'Sobriété et liberté : à la recherche d''un équilibre'),
(17004, 1000, 16003, NULL, 19000, '2019-05-19', 1, 'paper', 12000, 0, 'Abonnement standard papier'),
(17005, 1002, 16004, NULL, 19001, '2021-01-25', 1, 'digital', 8000, 0, 'Abonnement standard numérique');

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

REPLACE INTO session (id, start_date, end_date, name, region, locality, street, dates) VALUES
(20000, '2032-02-01', '2032-02-02', 'Lausanne 2032-2', 'Vaud', 'Lausanne', 'Rue de lausanne 1', '["1er fevrier", "14 février", "31 février"]'),
(20001, '2032-03-01', '2032-03-02', 'Lausanne 2032-3', 'Vaud', 'Lausanne', 'Rue de lausanne 2', '["1er mars", "14 mars", "31 mars"]'),
(20002, '2032-04-01', '2032-04-02', 'Lausanne 2032-4', 'Vaud', 'Lausanne', 'Rue de lausanne 3', '["1er avril", "14 avril", "31 avril"]'),
(20003, '2032-03-01', '2032-03-02', 'Lutry 2032-3', 'Vaud', 'Lutry', 'Rue de lutry 1', '["2 mars", "15 mars", "30 mars"]'),
(20004, '2032-05-01', '2032-05-02', 'Lutry 2032-4', 'Vaud', 'Lutry', 'Rue de lutry 2', '["2 mai", "15 mai", "30 mai"]'),
(20005, '2032-03-01', '2032-03-02', 'Neuchâtel 2032-3', 'Neuchâtel', 'Neuchâtel', 'Rue de neuchâtel 2', '["2 mars", "15 mars", "30 mars"]'),
(20006, '2016-04-01', '2016-04-02', 'Lausanne 2016-4 (passé)', 'Vaud', 'Lausanne', 'Rue de lausanne 3', '["1er avril", "14 avril", "31 avril"]');

REPLACE INTO news (id, is_active, date, name, description, content) VALUES
(30000, TRUE, '2019-01-01', 'Maecenas sed diam eget', 'Maecenas sed diam eget risus varius blandit sit amet non magna.', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.'),
(30001, TRUE, '2019-02-01', 'Nullam id dolor id nibh', 'Nullam id dolor id nibh ultricies vehicula ut id elit.', 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui.'),
(30002, TRUE, '2019-03-01', 'Vivamus sagittis lacus', 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.', 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(30003, TRUE, '2019-04-01', 'Maecenas sed diam', 'Maecenas sed diam eget risus varius blandit sit amet non magna.', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.'),
(30004, TRUE, '2019-05-01', 'Nullam id dolor', 'Nullam id dolor id nibh ultricies vehicula ut id elit.', 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui.'),
(30005, TRUE, '2019-06-01', 'Vivamus sagittis lacus vel augue', 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.', 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(30006, TRUE, '2019-07-01', 'Maecenas sed diam eget risus', 'Maecenas sed diam eget risus varius blandit sit amet non magna.', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.'),
(30007, TRUE, '2019-08-01', 'Nullam id dolor id nibh', 'Nullam id dolor id nibh ultricies vehicula ut id elit.', 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui.'),
(30008, TRUE, '2019-09-01', 'Vivamus sagittis lacus', 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.', 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
(30009, TRUE, '2019-10-01', 'Maecenas sed diam eget', 'Maecenas sed diam eget risus varius blandit sit amet non magna.', 'Maecenas sed diam eget risus varius blandit sit amet non magna. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.'),
(30010, TRUE, '2019-11-01', 'Nullam id dolor id nibh', 'Nullam id dolor id nibh ultricies vehicula ut id elit.', 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Donec sed odio dui.'),
(30011, FALSE, '2022-12-01', '', 'Actualité future (devrait être masqué)', 'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

REPLACE INTO event (id, date, name, place, type) VALUES
(40000, '2019-01-01', 'Evénement passé (devrait être masqué)', 'Berne', 'Manifestation'),
(40001, '2022-02-01', 'Vestibulum id ligula porta felis euismod semper.', 'Fribourg', 'Débat'),
(40002, '2022-03-01', 'Nullam quis risus eget urna mollis ornare vel eu leo.', 'Neuchâtel', 'Spectacle'),
(40003, '2022-04-01', 'Aenean eu leo quam', 'Berne', 'Manifestation'),
(40004, '2022-05-01', 'Vestibulum id ligula porta felis euismod semper.', 'Fribourg', 'Débat'),
(40005, '2022-06-01', 'Nullam quis risus eget urna mollis ornare vel eu leo.', 'Neuchâtel', 'Spectacle'),
(40006, '2022-07-01', 'Aenean eu leo quam', 'Berne', 'Manifestation'),
(40007, '2022-08-01', 'Vestibulum id ligula porta felis euismod semper.', 'Fribourg', 'Débat'),
(40008, '2022-09-01', 'Nullam quis risus eget urna mollis ornare vel eu leo.', 'Neuchâtel', 'Spectacle'),
(40009, '2022-10-01', 'Aenean eu leo quam', 'Berne', 'Manifestation'),
(40010, '2022-11-01', 'Vestibulum id ligula porta felis euismod semper.', 'Fribourg', 'Débat'),
(40011, '2022-12-01', 'Nullam quis risus eget urna mollis ornare vel eu leo.', 'Neuchâtel', 'Spectacle');

REPLACE INTO organization (id, subscription_last_review_id, pattern)
VALUES (50000, 3000, '.*@.*university\\.com'),
(50001, 3001, '.*@teachers\\.university\\.com');

-- Give a valid subscription and membership to othermember
UPDATE user SET
    subscription_type = 'digital',
    subscription_last_review_id = 3001,
    membership = 'member'
WHERE id = 1003;

COMMIT;

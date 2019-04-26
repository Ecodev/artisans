START TRANSACTION;

REPLACE INTO account (id, parent_id, owner_id, type, code, iban, name) VALUES
(10000, NULL, NULL, 'group', '1', '', 'Actifs'),
(10001, NULL, NULL, 'group', '2', '', 'Passifs'),
(10002, NULL, NULL, 'group', '3', '', 'Produits'),
(10003, NULL, NULL, 'group', '4', '', 'Charges de matériel, de marchandises et prestations de tiers'),
(10004, NULL, NULL, 'group', '5', '', 'Charges de personnel'),
(10005, NULL, NULL, 'group', '6', '', 'Autres charges exploitation, amortissement, ajustement de valeur'),
(10006, NULL, NULL, 'group', '7', '', 'Résultat des activités annexes d\'exploitation'),
(10007, NULL, NULL, 'group', '8', '', 'Résultats extraordinaires et hors exploitation'),
(10008, NULL, NULL, 'group', '9', '', 'Clôture'),
(10009, 10000, NULL, 'group', '100', '', 'Liquidités'),
(10010, 10000, NULL, 'group', '150', '', 'Immobilisation corporelles meubles'),
(10011, 10001, NULL, 'group', '20', '', 'Dettes à court terme'),
(10012, 10008, NULL, 'equity', '9200', '', 'Bénéfices / perte de l\'exercice'),
(10013, 10002, NULL, 'revenue', '3200', '', 'Vente de marchandises'),
(10014, 10002, NULL, 'revenue', '3800', '', 'Déductions sur les ventes'),
(10018, 10003, NULL, 'expense', '4000', '', 'Charges de matériel de l\'épicerie'),
(10019, 10003, NULL, 'expense', '4200', '', 'Achats de marchandises destinées à la revente'),
(10020, 10003, NULL, 'expense', '4400', '', 'Prestations / travaux de tiers'),
(10021, 10003, NULL, 'expense', '4900', '', 'Déductions sur les charges'),
(10022, 10005, NULL, 'expense', '6000', '', 'Charges de locaux'),
(10023, 10005, NULL, 'expense', '6100', '', 'Entretien, réparations et remplacement des installations servant à l’exploitation'),
(10024, 10005, NULL, 'expense', '6200', '', 'Charges de véhicules et de transport'),
(10025, 10005, NULL, 'expense', '6300', '', 'Assurances-choses, droits, taxes, autorisations'),
(10026, 10005, NULL, 'expense', '6500', '', 'Charges d''administration'),
(10027, 10005, NULL, 'expense', '6570', '', 'Informatique'),
(10028, 10005, NULL, 'expense', '6700', '', 'Autres charges d\'exploitation'),
(10029, 10009, NULL, 'asset', '1000', '', 'Caisse'),
(10030, 10009, NULL, 'asset', '1020', 'CH8297387643415852735', 'Banque'),
(10031, 10010, NULL, 'asset', '1500', '', 'Machines et appareils'),
(10032, 10010, NULL, 'asset', '1510', '', 'Mobilier et installations'),
(10033, 10007, NULL, 'expense', '8000', '', 'Charges hors exploitation'),
(10034, 10007, NULL, 'revenue', '8100', '', 'Produits hors exploitation'),
(10035, 10007, NULL, 'expense', '8500', '', 'Charges extraordinaires, exceptionnelles ou hors période'),
(10036, 10007, NULL, 'revenue', '8510', '', 'Produits extraordinaires, exceptionnels ou hors période'),
(10037, 10011, NULL, 'group', '2000', '', 'Dettes résultant d\'achats et de prestation de services (fournisseurs)'),
(10038, 10011, NULL, 'group', '2030', '', 'Acomptes de clients'),
(10039, 10011, NULL, 'liability', '2200', '', 'TVA due'),
(10040, 10011, NULL, 'liability', '2210', '', 'Autres dettes à court terme'),
(10041, 10001, NULL, 'group', '28', '', 'Fonds propres'),
(10042, 10041, NULL, 'equity', '2800', '', 'Capital social'),
(10043, 10037, NULL, 'liability', '200010', '', 'Fournisseur A'),
(10044, 10037, NULL, 'liability', '200011', '', 'Fournisseur B'),
(10045, 10037, NULL, 'liability', '200012', '', 'Fournisseur C'),
(-10000, 10038, -1000, 'liability', '20300000', '', 'Administrator'),
(-10001, 10038, -1001, 'liability', '20300001', '', 'Responsable'),
(-10002, 10038, -1002, 'liability', '20300002', '', 'Active Member'),
(-10010, 10038, -1010, 'liability', '20300010', '', 'Voilier Member'),
(-10011, 10038, -1006, 'liability', '20300006', '', 'Archived Member'),
(-10012, 10038, -1005, 'liability', '20300005', '', 'Inactive Member'),
(-10013, 10038, -1004, 'liability', '20300004', '', 'New User'),
(-10014, 10038, -1003, 'liability', '20300003', '', 'Booking Only');

REPLACE INTO product_tag (id, name) VALUES
(6000, 'Fruits & Légumes'),
(6001, 'Viandes & Poissons'),
(6002, 'Produits laitiers, oeufs'),
(6003, 'Boulangerie et pâtisserie'),
(6004, 'Épicerie sucrée'),
(6005, 'Épicerie salée'),
(6006, 'Boissons'),
(6007, 'Hygiène & Beauté'),
(6008, 'Entretien & Nettoyage');

REPLACE INTO image (id, filename, width, height) VALUES
(5000, 'chocolat1.jpg', 329, 727),
(5001, 'chocolat2.jpg', 712, 551),
(5002, 'oeufs.jpg', 600, 600),
(5003, 'salade.jpg', 500, 500),
(5004, 'patates.jpg', 1024, 768),
(5005, 'pomme.jpg', 800, 531),
(5006, 'poire.jpg', 800, 800),
(5007, 'vin1.jpg', 208, 800),
(5008, 'vin2.jpg', 630, 330),
(5009, 'yogourt1.jpg', 701, 800),
(5010, 'yogourt2.png', 388, 407),
(5011, 'miel.png', 308, 436);

REPLACE INTO product (id, image_id, supplier_price, price_per_unit, unit, vat_rate, name, code, description) VALUES
(3000, 5000, 5.00, 6.00, '', '0.077', 'Chocolat noir BIO', 'P1', 'Tablette de chocolat • Noir 70%, avec fèves de cacao'),
(3001, 5001, 20.00, 24.00, '', '0.077', '12 pralinés avec alcool', 'P2', 'Un assortiment représentatif du savoir-faire de Jacot Chocolatier : ganache, masse pralinée, gianduja, massepain. Nous prêtons une attention toute particulière à la confection des chocolats et des emballages, pour une livraison et une dégustation de qualité.'),
(3002, 5002, 5.00, 6.00, '', '0.025', '6 oeufs BIO de la région', 'P3', 'Oeufs suisses 53g+ d''élevage en plein air'),
(3003, 5003, 3.00, 4.00, '', '0.025', 'Salade Batavia BIO', 'P4', 'La batavia n’est pas aussi robuste que l''iceberg mais est moins sensible que la laitue pommée. Si vous ne la consommez pas immédiatement, emballez-la dans un papier absorbant humide. Elle se conservera 2 à 3 jours dans le compartiment à légumes'),
(3004, 5004, 2.00, 2.50, 'kg', '0.025', 'Pommes de terre', 'P5', ''),
(3005, 5005, 3.00, 4.00, 'kg', '0.025', 'Pommes', 'P6', ''),
(3006, 5006, 3.00, 4.00, 'kg', '0.025', 'Poire', 'P7', ''),
(3007, 5007, 8.00, 10.00, '', '0.077', 'Oeil de Perdrix Auvernier', 'P8', ''),
(3008, 5008, 10.00, 13.00, '', '0.077', 'Pinot Noir La Coccinelle', 'P9', ''),
(3009, 5009, 1.10, 1.60, '', '0.025', 'Yogourt Bircher', 'P10', ''),
(3010, 5010, 1.30, 2.00, '', '0.025', 'Yogourt vanille au lait de brebis', 'P11', ''),
(3011, 5011, 10.00, 12.50, '', '0.0', 'Miel de la région', 'P12', '');

REPLACE INTO product_tag_product (product_tag_id, product_id) VALUES
(6004, 3000),
(6004, 3001),
(6002, 3002),
(6000, 3003),
(6000, 3004),
(6000, 3005),
(6000, 3006),
(6006, 3007),
(6006, 3008),
(6002, 3009),
(6002, 3010),
(6004, 3011);

REPLACE INTO expense_claim (id, creation_date, owner_id, amount, status, name, description, type) VALUES
(7000, '2019-03-10', -1002, 200.00, 'new', 'achats Jumbo', 'matériaux pour étagère', 'expenseClaim'),
(7001, '2019-03-14', -1002, 100.00, 'processed', 'Produits de nettoyage', 'Facture Migros du 10.03.2019', 'expenseClaim'),
(7002, '2019-03-14', -1002, 50.00, 'processing', 'remboursement bancaire', '', 'refund'),
(7003, '2019-01-10', -1007, 75.00, 'new', 'achats boissons', 'pour la fête', 'expenseClaim');

REPLACE INTO transaction (id, creator_id, owner_id, transaction_date, name, remarks, expense_claim_id) VALUES
(8000, -1000, -1000, '2019-01-01', 'Solde à nouveau', 'Ouverture des comptes en début d\'exercice', NULL),
(8001, -1000, -1000, '2019-02-04', 'Achat réfrigérateur', 'Paiement partiel par banque et caisse', NULL),
(8003, NULL, NULL, '2019-04-15', 'Traitement de la dépense "Produits de nettoyage"', '', 7001),
(8004, -1002, -1002, '2019-04-05', 'Versement en ligne', '', NULL),
(8005, -1002, NULL, '2019-04-24', 'Vente 1', '', NULL),
(8006, -1007, NULL, '2019-04-25', 'Vente 2', '', NULL);

REPLACE INTO transaction_tag (id, name) VALUES
(15000, 'Entretien');

REPLACE INTO transaction_line (id, transaction_id, debit_id, credit_id, transaction_tag_id, balance, transaction_date, is_reconciled, name, remarks) VALUES
(14000, 8000, 10029, 10042, NULL, 1000, '2019-01-01', 1, 'Solde à nouveau', 'Ouverture de caisse'),
(14001, 8000, 10030, 10042, NULL, 23500, '2019-01-01', 1, 'Solde à nouveau', 'Ouverture de banque'),
(14002, 8001, 10032, NULL, NULL, 1500, '2019-02-03', 1, 'Achat réfrigérateur', ''),
(14003, 8001, NULL, 10029, NULL, 500, '2019-02-03', 1, 'Paiement en espèces', ''),
(14004, 8001, NULL, 10030, NULL, 1000, '2019-02-04', 0, 'Paiement carte Maestro', ''),
(14005, 8003, 10028, -10002, 15000, 100, '2019-03-15', 1, 'Remboursement sur le solde', ''),
(14006, 8004, 10030, -10002, NULL, 200.00, '2019-03-10', 1, 'Paiement par carte de crédit', ''),
(14007, 8005, -10002, 10013, NULL, 27.40, '2019-04-24', 1, 'Achats du responsable', ''),
(14008, 8006, -10002, 10013, NULL, 62.40, '2019-04-24', 1, 'Achats du conjoint', '');

REPLACE INTO accounting_document (id, expense_claim_id, owner_id, filename, mime) VALUES
(9000, 7000, -1002, 'dw4jV3zYSPsqE2CB8BcP8ABD0.pdf', 'application/pdf');

REPLACE INTO message (id, creator_id, owner_id, recipient_id, type, date_sent, email, subject, body) VALUES
(11001, -1000, -1000, -1002, 'balance', '2019-01-01 12:00:00','member@example.com', 'Avertissement de crédit négatif', 'Bonjour, nous vous informons que votre compte Emmy présente un solde négatif'),
(11002, -1001, -1001, -1005, 'reset_password', NULL,'inactive@example.com', 'Nettoyage local', 'Bonjour, nous vous invitons à venir nous aider pour le nettoyage de printemps du local');

REPLACE INTO user_tag (id, creator_id, owner_id, name, color) VALUES
(12000, -1000, -1000, 'Secteur EPI', '#cD4A50'),
(12001, -1000, -1000, 'Secteur PROD', '#cD4A50'),
(12002, -1000, -1000, 'Secteur COOP', '#cD4A50'),
(12003, -1000, -1000, 'Secteur MAG', '#cD4A50'),
(12004, -1000, -1000, 'Secteur ADMIN', '#cD4A50'),
(12005, -1000, -1000, 'Secteur FIN', '#cD4A50'),
(12006, -1000, -1000, 'Equipe 1', '#A4CE4C'),
(12007, -1000, -1000, 'Equipe 2', '#A4CE4C'),
(12008, -1000, -1000, 'Equipe 3', '#A4CE4C'),
(12009, -1000, -1000, 'Equipe 4', '#A4CE4C');

REPLACE INTO user_tag_user (user_tag_id, user_id) VALUES
(12000, -1008),
(12001, -1009),
(12006, -1008),
(12007, -1009),
(12007, -1010);

REPLACE INTO product_metadata (id, product_id, name, value) VALUES
(13000, 3009, 'Contenance', '150g'),
(13001, 3010, 'Contenance', '150g'),
(13002, 3007, 'Contenance', '75cl'),
(13003, 3008, 'Contenance', '75cl');

REPLACE INTO `order` (id, owner_id, creator_id, creation_date, transaction_id) VALUES
(16000, -1002, -1002, '2019-04-24', 8005),
(16001, -1007, -1007, '2019-04-25', 8006);

REPLACE INTO order_line (id, owner_id, order_id, product_id, creation_date, quantity, unit, balance, vat_rate, name) VALUES
(17000, -1002, 16000, 3000, '2019-04-24', 2, '', 10.00, 0.077, 'Chocolat noir BIO'),
(17001, -1002, 16000, 3002, '2019-04-24', 1, '', 5.00, 0.077, '6 oeufs BIO de la région'),
(17002, -1002, 16000, 3011, '2019-04-24', 1, '', 10.00, 0.00, 'Miel de la région'),
(17003, -1002, 16000, 3005, '2019-04-24', 0.6, 'kg', 2.40, 0.025, 'Pommes'),
(17004, -1007, 16001, 3011, '2019-04-25', 2, '', 10.00, 0.00, 'Miel de la région'),
(17005, -1007, 16001, 3005, '2019-04-25', 0.6, 'kg', 2.40, 0.025, 'Pommes'),
(17006, -1007, 16001, 3005, '2019-04-25', 5, '', 50.00, 0.077, 'Pinot Noir La Coccinelle');


COMMIT;

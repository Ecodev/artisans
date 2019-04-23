START TRANSACTION;

REPLACE INTO account (id, parent_id, owner_id, type, code, balance, iban, name) VALUES
(10000, NULL, NULL, 'group', '1', 0.00, '', 'Actifs'),
(10001, NULL, NULL, 'group', '2', 0.00, '', 'Passifs'),
(10002, NULL, NULL, 'group', '3', 0.00, '', 'Produits'),
(10003, NULL, NULL, 'group', '4', 0.00, '', 'Charges de matériel, de marchandises et prestations de tiers'),
(10004, NULL, NULL, 'group', '5', 0.00, '', 'Charges de personnel'),
(10005, NULL, NULL, 'group', '6', 0.00, '', 'Autres charges exploitation, amortissement, ajustement de valeur'),
(10006, NULL, NULL, 'group', '7', 0.00, '', 'Résultat des activités annexes d''exploitation'),
(10007, NULL, NULL, 'group', '8', 0.00, '', 'Résultats extraordinaires et hors exploitation'),
(10008, NULL, NULL, 'group', '9', 0.00, '', 'Clôture'),
(10009, 10000, NULL, 'group', '100', 0.00, '', 'Liquidités'),
(10010, 10000, NULL, 'group', '150', 0.00, '', 'Immobilisation corporelles meubles'),
(10011, 10001, NULL, 'group', '2030', 0.00, '', 'Acomptes de clients'),
(10012, 10008, NULL, 'equity', '9200', 0.00, '', 'Bénéfice / perte de l''exercice'),
(10013, 10002, NULL, 'revenue', '3200', 0.00, '', 'Vente de matériel'),
(10014, 10002, NULL, 'group', '3400', 0.00, '', 'Vente de prestation'),
(10015, 10003, NULL, 'expense', '4400', 0.00, '', 'Prestations / travaux de tiers'),
(10016, 10004, NULL, 'group', '5000', 0.00, '', 'Salaires'),
(10017, 10004, NULL, 'expense', '5900', 0.00, '', 'Personnel temporaire'),
(10018, 10005, NULL, 'group', '6000', 0.00, '', 'Charges de locaux'),
(10019, 10005, NULL, 'group', '6100', 0.00, '', 'Entretien, réparations et remplacement des inst. servant à l’exploitation'),
(10020, 10005, NULL, 'expense', '6200', 0.00, '', 'Charges de véhicules et de transport'),
(10021, 10005, NULL, 'group', '6500', 0.00, '', 'Charges d''administration'),
(10022, 10005, NULL, 'expense', '6600', 100.00, '', 'Publicité'),
(10023, 10009, NULL, 'asset', '1000', 0.00, '', 'Caisse'),
(10024, 10009, NULL, 'group', '1020', 0.00, '', 'Banque'),
(10025, 10024, NULL, 'asset', '10201', 8187.50, 'CH7609000000200061375', 'PostFinance 20-6137-5'),
(10026, 10024, NULL, 'asset', '10202', 17000.00, 'CH0980241000004014701', 'Raiffeisen 4014701'),
(10027, 10010, NULL, 'asset', '1500', 0.00, '', 'Machines et appareils'),
(10028, 10010, NULL, 'group', '1510', 0.00, '', 'Mobilier et installations'),
(10029, 10028, NULL, 'asset', '15101', 0.00, '', 'Barque'),
(10030, 10028, NULL, 'asset', '15102', 0.00, '', 'Bateau à moteur'),
(10031, 10028, NULL, 'asset', '15103', 0.00, '', 'Planche à voile'),
(10032, 10028, NULL, 'asset', '15104', 0.00, '', 'SUP'),
(10033, 10028, NULL, 'asset', '15105', 0.00, '', 'Voilier - biquille'),
(10034, 10028, NULL, 'asset', '15106', 10000.00, '', 'Voilier'),
(10035, 10014, NULL, 'revenue', '34000', 90.00, '', 'Cotisations'),
(10036, 10014, NULL, 'revenue', '34001', 50.00, '', 'Location casiers'),
(10037, 10014, NULL, 'revenue', '34002', 100.00, '', 'Cours nautique'),
(10038, 10014, NULL, 'revenue', '34003', 0.00, '', 'Semaine nautique'),
(10039, 10016, NULL, 'expense', '50000', 0.00, '', 'Animateurs'),
(10040, 10018, NULL, 'expense', '60001', 0.00, '', 'Loyer'),
(10041, 10018, NULL, 'expense', '60002', 0.00, '', 'Eau'),
(10042, 10018, NULL, 'expense', '60003', 0.00, '', 'Électricité'),
(10043, 10018, NULL, 'expense', '60004', 0.00, '', 'Télécom'),
(10044, 10018, NULL, 'expense', '60005', 0.00, '', 'Râtelier couvert'),
(10045, 10018, NULL, 'expense', '60006', 0.00, '', 'Assurance'),
(10046, 10018, NULL, 'expense', '60007', 0.00, '', 'Entretien'),
(10047, 10018, NULL, 'expense', '60008', 0.00, '', 'Divers'),
(10048, 10019, NULL, 'expense', '61000', 0.00, '', 'Barque'),
(10049, 10019, NULL, 'expense', '61001', 0.00, '', 'Bateau à moteur'),
(10050, 10019, NULL, 'expense', '61002', 0.00, '', 'Canoës / kayak'),
(10051, 10019, NULL, 'expense', '61003', 0.00, '', 'Planche à voile'),
(10052, 10019, NULL, 'expense', '61004', 0.00, '', 'SUP'),
(10053, 10019, NULL, 'expense', '61005', 0.00, '', 'Voilier - biquille'),
(10054, 10019, NULL, 'expense', '61006', 0.00, '', 'Voiliers'),
(10055, 10048, NULL, 'expense', '610001', 0.00, '', 'Taxe navigation'),
(10056, 10048, NULL, 'expense', '610002', 0.00, '', 'Entretien'),
(10057, 10048, NULL, 'expense', '610003', 0.00, '', 'Autres dépenses'),
(10058, 10049, NULL, 'expense', '610011', 0.00, '', 'Taxe navigation'),
(10059, 10049, NULL, 'expense', '610012', 0.00, '', 'Entretien'),
(10060, 10049, NULL, 'expense', '610013', 0.00, '', 'Assurances'),
(10061, 10049, NULL, 'expense', '610014', 0.00, '', 'Emplacement'),
(10062, 10049, NULL, 'expense', '610015', 0.00, '', 'Autres dépenses'),
(10063, 10050, NULL, 'expense', '610021', 0.00, '', 'Taxe navigation'),
(10064, 10050, NULL, 'expense', '610022', 0.00, '', 'Entretien'),
(10065, 10050, NULL, 'expense', '610023', 0.00, '', 'Emplacement'),
(10066, 10051, NULL, 'expense', '610031', 0.00, '', 'Entretien'),
(10067, 10051, NULL, 'expense', '610032', 0.00, '', 'Emplacement'),
(10068, 10051, NULL, 'expense', '610033', 0.00, '', 'Autres dépenses'),
(10069, 10052, NULL, 'expense', '610041', 0.00, '', 'Entretien'),
(10070, 10052, NULL, 'expense', '610042', 0.00, '', 'Emplacement'),
(10071, 10052, NULL, 'expense', '610043', 0.00, '', 'Autres dépenses'),
(10072, 10053, NULL, 'expense', '610051', 0.00, '', 'Taxe navigation'),
(10073, 10053, NULL, 'expense', '610052', 0.00, '', 'Entretien'),
(10074, 10053, NULL, 'expense', '610053', 0.00, '', 'Assurances'),
(10075, 10053, NULL, 'expense', '610054', 0.00, '', 'Emplacement'),
(10076, 10053, NULL, 'expense', '610055', 0.00, '', 'Transport'),
(10077, 10053, NULL, 'expense', '610056', 0.00, '', 'Autres dépenses'),
(10078, 10054, NULL, 'expense', '610061', 0.00, '', 'Taxe navigation'),
(10079, 10054, NULL, 'expense', '610062', 0.00, '', 'Entretien'),
(10080, 10054, NULL, 'expense', '610063', 0.00, '', 'Assurances'),
(10081, 10054, NULL, 'expense', '610064', 0.00, '', 'Emplacement'),
(10082, 10054, NULL, 'expense', '610065', 0.00, '', 'Transport'),
(10083, 10054, NULL, 'expense', '610066', 0.00, '', 'Inspection'),
(10084, 10054, NULL, 'expense', '610067', 0.00, '', 'Autres dépenses'),
(10085, 10021, NULL, 'expense', '65001', 12.50, '', 'Photocopies'),
(10086, 10021, NULL, 'expense', '65002', 0.00, '', 'Envois timbres'),
(10087, 10021, NULL, 'expense', '65003', 0.00, '', 'Frais bancaires'),
(10088, 10021, NULL, 'expense', '65004', 0.00, '', 'AG'),
(10089, 10021, NULL, 'expense', '65005', 0.00, '', 'Journée travail'),
(10090, 10021, NULL, 'expense', '65006', 0.00, '', 'Séance accueil'),
(10091, 10021, NULL, 'expense', '65007', 0.00, '', 'Travail pour le club'),
(10092, 10021, NULL, 'expense', '65008', 0.00, '', 'Comité'),
(10093, 10021, NULL, 'expense', '65009', 0.00, '', 'Divers'),
(10094, 10011, -1000, 'liability', '20300001', 0.00, '', 'Administrator'),
(10095, 10011, -1001, 'liability', '20300002', 0.00, '', 'Responsable'),
(10096, 10011, -1002, 'liability', '20300003', 50.00, '', 'Active Member'),
(10097, 10011, -1007, 'liability', '20300004', 0.00, '', 'Conjoint'),
(10098, 10011, -1010, 'liability', '20300007', 0.00, '', 'Voilier Member'),
(10099, 10011, -1011, 'liability', '20300008', 0.00, '', 'Voilier Family'),
(10100, 10007, NULL, 'expense', '8000', 0.00, '', 'Charges hors exploitation'),
(10101, 10007, NULL, 'revenue', '8100', 0.00, '', 'Produits hors exploitation'),
(10102, 10007, NULL, 'expense', '8500', 0.00, '', 'Charges extraordinaires, exceptionnelles ou hors période'),
(10103, 10007, NULL, 'revenue', '8510', 0.00, '', 'Produits extraordinaires, exceptionnels ou hors période'),
(10104, 10001, NULL, 'liability', '2600', 10.00, '', 'Provisions pour réparations'),
(10105, 10001, NULL, 'group', '28', 0.00, '', 'Fonds propres'),
(10106, 10105, NULL, 'equity', '2800', 35000.00, '', 'Capital social');


REPLACE INTO product_tag (id, name, color) VALUES
(6000, 'Boulangerie', '#c67347'),
(6001, 'Fruits et légumes', '#c83023'),
(6002, 'Céréales', '#d1b075'),
(6003, 'Produits laitiers', '#58b5e6');

REPLACE INTO image (id, filename, width, height) VALUES
(5000, 'chat1.jpg', 1000, 482),
(5001, 'chat2.jpg', 1024, 680),
(5002, 'chat3.jpg', 625, 768),
(5003, 'chat4.jpg', 767, 767),
(5004, 'chat5.jpg', 1144, 899),
(5005, 'chat6.jpg', 630, 330),
(5006, 'chat7.jpg', 820, 457),
(5007, 'chat8.jpg', 1000, 1000);

REPLACE INTO product (id, image_id, credit_account_id, supplier_price, price_per_unit, unit, vat_rate, name, code, description) VALUES
(3000, 5000, 10013, 1, 2, 'kg', '7.7', 'Produit 1', 'P1', 'No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 5001, 10013, 2, 4, '', '2.5', 'Produit 2', 'P2', 'La marche des vertueux est semée d’obstacles qui sont les entreprises égoïstes que fait sans fin, surgir l’œuvre du malin. Béni soit-il l’homme de bonne volonté qui, au nom de la charité se fait le berger des faibles qu’il guide dans la vallée d’ombre de la mort et des larmes, car il est le gardien de son frère et la providence des enfants égarés. J’abattrai alors le bras d’une terrible colère, d’une vengeance furieuse et effrayante sur les hordes impies qui pourchassent et réduisent à néant les brebis de Dieu. Et tu connaîtras pourquoi mon nom est l’éternel quand sur toi, s’abattra la vengeance du Tout-Puissant !'),
(3002, 5002, 10013, 1,  2.5, '', '7.7', 'Produit 3', 'P3', 'Pour demande de stockage.'),
(3003, 5003, 10013, 0.5, 1, 'kg', '2.5', 'Produit 4', 'P4', 'Casier physique XYZ.'),
(3004, 5004, 10013, 3.5, 7, '', '7.7', 'Produit 5', 'P5', 'Service supplémentaire.'),
(3005, 5005, 10013, 1, 2, '', '2.5', 'Produit 6', 'P6', 'Pour adhésion et cotisation.'),
(3006, 5006, 10013, 2, 3.95, 'kg', '7.7', 'Produit 7', 'P7', 'Pour adhésion et cotisation. '),
(3007, 5007, 10013, 1.5, 1.95, '', '2.5', 'Produit 8', 'P8', 'Pour carnet de sortie, mais avec certification, et avec une description assez courte');

REPLACE INTO product_tag_product (product_tag_id, product_id) VALUES
(6000, 3000),
(6001, 3001);

REPLACE INTO expense_claim (id, creation_date, owner_id, amount, status, name, description, type) VALUES
(7000, '2019-01-10', -1002, 200.00, 'new', 'achats Jumbo', 'outils pour voilier', 'expenseClaim'),
(7001, '2019-01-14', -1002, 100.00, 'processed', 'flyers', 'Cighelio', 'expenseClaim'),
(7002, '2019-03-14', -1002, 50.00, 'processing', 'remboursement bancaire', '', 'refund'),
(7003, '2019-01-10', -1007, 75.00, 'new', 'achats boissons', 'pour la fête', 'expenseClaim');

REPLACE INTO transaction (id, creator_id, owner_id, transactionDate, name, remarks, expense_claim_id) VALUES
(8000, -1002, -1002, '2019-03-01', 'Inscription cours nautique Active Member', '', NULL),
(8001, NULL, NULL, '2019-03-10', 'Photocopies pour comité', '', NULL),
(8002, -1002, -1002, '2019-03-12', 'Cotisation 2019', '', NULL),
(8003, NULL, NULL, '2019-01-15', 'Remboursement flyers pour cours nautique', 'Facture Cighelio du 10.01.2019', 7001),
(8004, NULL, NULL, '2019-02-05', 'Location casier 1012', '', NULL),
(8005, -1000, -1000, '2019-02-04', 'Achat d''un nouveau voilier', 'Paiement partiel par banque et poste', NULL),
(8006, -1002, -1002, '2019-04-05', 'Versement en ligne', '', NULL),
(8007, -1000, -1000, '2019-01-01', 'Solde à nouveau', 'Ouverture des comptes en début d\'exercice', NULL);

REPLACE INTO transaction_tag (id, name) VALUES
(15000, 'Régate 2019'),
(15001, 'Cours 2019'),
(15002, 'Tombola 2019'),
(15003, 'Camp J+S 2019'),
(15004, 'Camp France 2019'),
(15005, 'Semaine nautique 2019');

REPLACE INTO transaction_line (id, transaction_id, debit_id, credit_id, product_id, transaction_tag_id, balance, transactionDate, is_reconciled, name, remarks) VALUES
(14000, 8000, 10096, 10037, NULL, 15001, 100.00, '2019-03-01', 1, 'Inscription cours nautique Active Member', ''),
(14001, 8001, 10085, 10025, NULL, NULL, 12.50, '2019-03-10', 1, 'Paiement par Postcard', ''),
(14002, 8002, 10096, 10035, NULL, NULL, 90.00, '2019-03-12', 1, 'Cotisation 2019', ''),
(14003, 8003, 10022, 10096, NULL, 15001, 100, '2019-03-15', 1, 'Remboursement flyers', ''),
(14004, 8004, 10096, 10036, 3003, NULL, 50, '2019-02-05', 1, 'Loyer casier', ''),
(14005, 8005, 10034, NULL, 3007, NULL, 10000, '2019-02-03', 1, 'Acquisition voilier NE123456', ''),
(14006, 8005, NULL, 10025, NULL, NULL, 7000, '2019-02-03', 1, 'Paiement voilier par PostFinance', ''),
(14007, 8005, NULL, 10026, NULL, NULL, 3000, '2019-02-04', 0, 'Paiement voilier par Raiffeisen', ''),
(14008, 8006, 10025, 10096, NULL, NULL, 200.0, '2019-04-05', 0, 'Versement en ligne', ''),
(14009, 8007, 10025, 10106, NULL, NULL, 15000, '2019-01-01', 1, 'Solde à nouveau', 'Ouverture du CCP'),
(14010, 8007, 10026, 10106, NULL, NULL, 20000, '2019-01-01', 1, 'Solde à nouveau', 'Ouverture de Raiffeisen'),
(14011, 8002, 10096, 10104, NULL, NULL, 10.00, '2019-03-12', 1, 'Contribution au fond de réparation interne', '');

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
(13000, 3000, 'Largeur', '1405 mm'),
(13001, 3000, 'Hauteur', '1605 mm');

COMMIT;

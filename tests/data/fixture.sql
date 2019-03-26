START TRANSACTION;

REPLACE INTO user (id, owner_id, login, first_name, last_name, email, password, role, status, welcome_session_date, family_relationship, door4, iban) VALUES
(1000, NULL, 'administrator', 'Admin', 'Istrator', 'administrator@example.com', MD5('administrator'), 'administrator', 'active', '2018-01-01 12:00:00', 'householder', 1, NULL),
(1001, NULL, 'responsible', 'Respon', 'Sable', 'responsible@example.com', MD5('responsible'), 'responsible', 'active', '2018-01-01 12:00:00', 'householder', 1, NULL),
(1002, NULL, 'member', 'Active', 'Member', 'member@example.com', MD5('member'), 'member', 'active', '2018-01-01 12:00:00', 'householder', 0, 'CH4200681926673315051'),
(1003, NULL, 'bookingonly', 'Booking', 'Only', 'bookingonly@example.com', MD5('bookingonly'), 'booking_only', 'active', '2018-01-01 12:00:00', 'householder', 0, NULL),
(1004, NULL, 'newmember', 'New', 'User', 'newmember@example.com', MD5('newmember'), 'member', 'new', NULL, 'householder', 0, NULL),
(1005, NULL, 'inactive', 'Inactive', 'Member', 'inactive@example.com', MD5('inactive'), 'member', 'inactive', '2018-01-01 12:00:00', 'householder', 0, NULL),
(1006, NULL, 'archived', 'Archived', 'Member', 'archived@example.com', MD5('archived'), 'member', 'archived', '2018-01-01 12:00:00', 'householder', 0, NULL),
(1007, 1002, 'individual', 'Conj', 'Oint', 'conjoint@example.com', MD5('individual'), 'individual', 'active', '2018-01-01 12:00:00', 'partner', 0, 'CH6303714697192579556'),
(1008, 1002, 'son', 'So', 'n', NULL, MD5('son'), 'individual', 'active', '2018-01-01 12:00:00', 'child', 0, 'CH7826637586626482007'),
(1009, 1002, 'daughter', 'daugh', 'ter', NULL, MD5('daughter'), 'individual', 'active' ,'2018-01-01 12:00:00', 'child', 0, NULL),
(1010, NULL, 'voiliermember', 'Voilier', 'Member', 'voiliermember@example.com', MD5('voiliermember'), 'member', 'archived', '2018-01-01 12:00:00', 'householder', 0, NULL),
(1011, 1010, 'voilierfamily', 'Voilier', 'Family', 'voilierfamily@example.com', MD5('voilierfamily'), 'individual', 'active', '2018-01-01 12:00:00', 'partner', 0, NULL);

REPLACE INTO account (id, parent_id, owner_id, type, code, iban, name) VALUES
(10000, NULL, NULL, 'group', '1', '', 'Actifs'),
(10001, NULL, NULL, 'group', '2', '', 'Passifs'),
(10002, NULL, NULL, 'group', '3', '', 'Produits'),
(10003, NULL, NULL, 'group', '4', '', 'Charges de matériel, de marchandises et prestations de tiers'),
(10004, NULL, NULL, 'group', '5', '', 'Charges de personnel'),
(10005, NULL, NULL, 'group', '6', '', 'Autres charges exploitation, amortissement, ajustement de valeur'),
(10006, NULL, NULL, 'group', '7', '', 'Résultat des activités annexes d''exploitation'),
(10007, NULL, NULL, 'group', '8', '', 'Résultats extraordinaires et hors exploitation'),
(10008, NULL, NULL, 'group', '9', '', 'Clôture'),
(10009, 10000, NULL, 'group', '100', '', 'Liquidités'),
(10010, 10000, NULL, 'group', '150', '', 'Immobilisation corporelles meubles'),
(10011, 10001, NULL, 'group', '2030', '', 'Acomptes de clients'),
(10013, 10002, NULL, 'revenue', '3200', '', 'Vente de matériel'),
(10014, 10002, NULL, 'group', '3400', '', 'Vente de prestation'),
(10015, 10003, NULL, 'expense', '4400', '', 'Prestations / travaux de tiers'),
(10016, 10004, NULL, 'group', '5000', '', 'Salaires'),
(10017, 10004, NULL, 'expense', '5900', '', 'Personnel temporaire'),
(10018, 10005, NULL, 'group', '6000', '', 'Charges de locaux'),
(10019, 10005, NULL, 'group', '6100', '', 'Entretien, réparations et remplacement des inst. servant à l’exploitation'),
(10020, 10005, NULL, 'expense', '6200', '', 'Charges de véhicules et de transport'),
(10021, 10005, NULL, 'group', '6500', '', 'Charges d''administration'),
(10022, 10005, NULL, 'expense', '6600', '', 'Publicité'),
(10023, 10009, NULL, 'asset', '1000', '', 'Caisse'),
(10024, 10009, NULL, 'group', '1020', '', 'Banque'),
(10025, 10024, NULL, 'asset', '10201', 'CH7609000000200061375', 'PostFinance 20-6137-5'),
(10026, 10024, NULL, 'asset', '10202', 'CH0980241000004014701', 'Raiffeisen 4014701'),
(10027, 10010, NULL, 'asset', '1500', '', 'Machines et appareils'),
(10028, 10010, NULL, 'group', '1510', '', 'Mobilier et installations'),
(10029, 10028, NULL, 'asset', '15101', '', 'Barque'),
(10030, 10028, NULL, 'asset', '15102', '', 'Bateau à moteur'),
(10031, 10028, NULL, 'asset', '15103', '', 'Planche à voile'),
(10032, 10028, NULL, 'asset', '15104', '', 'SUP'),
(10033, 10028, NULL, 'asset', '15105', '', 'Voilier - biquille'),
(10034, 10028, NULL, 'asset', '15106', '', 'Voilier'),
(10035, 10014, NULL, 'revenue', '34000', '', 'Cotisations'),
(10036, 10014, NULL, 'revenue', '34001', '', 'Location casiers'),
(10037, 10014, NULL, 'revenue', '34002', '', 'Cours nautique'),
(10038, 10014, NULL, 'revenue', '34003', '', 'Semaine nautique'),
(10039, 10016, NULL, 'expense', '50000', '', 'Animateurs'),
(10040, 10018, NULL, 'expense', '60001', '', 'Loyer'),
(10041, 10018, NULL, 'expense', '60002', '', 'Eau'),
(10042, 10018, NULL, 'expense', '60003', '', 'Électricité'),
(10043, 10018, NULL, 'expense', '60004', '', 'Télécom'),
(10044, 10018, NULL, 'expense', '60005', '', 'Râtelier couvert'),
(10045, 10018, NULL, 'expense', '60006', '', 'Assurance'),
(10046, 10018, NULL, 'expense', '60007', '', 'Entretien'),
(10047, 10018, NULL, 'expense', '60008', '', 'Divers'),
(10048, 10019, NULL, 'expense', '61000', '', 'Barque'),
(10049, 10019, NULL, 'expense', '61001', '', 'Bateau à moteur'),
(10050, 10019, NULL, 'expense', '61002', '', 'Canoës / kayak'),
(10051, 10019, NULL, 'expense', '61003', '', 'Planche à voile'),
(10052, 10019, NULL, 'expense', '61004', '', 'SUP'),
(10053, 10019, NULL, 'expense', '61005', '', 'Voilier - biquille'),
(10054, 10019, NULL, 'expense', '61006', '', 'Voiliers'),
(10055, 10048, NULL, 'expense', '610001', '', 'Taxe navigation'),
(10056, 10048, NULL, 'expense', '610002', '', 'Entretien'),
(10057, 10048, NULL, 'expense', '610002', '', 'Autres dépenses'),
(10058, 10049, NULL, 'expense', '610011', '', 'Taxe navigation'),
(10059, 10049, NULL, 'expense', '610012', '', 'Entretien'),
(10060, 10049, NULL, 'expense', '610013', '', 'Assurances'),
(10061, 10049, NULL, 'expense', '610014', '', 'Emplacement'),
(10062, 10049, NULL, 'expense', '610015', '', 'Autres dépenses'),
(10063, 10050, NULL, 'expense', '610021', '', 'Taxe navigation'),
(10064, 10050, NULL, 'expense', '610022', '', 'Entretien'),
(10065, 10050, NULL, 'expense', '610023', '', 'Emplacement'),
(10066, 10051, NULL, 'expense', '610031', '', 'Entretien'),
(10067, 10051, NULL, 'expense', '610032', '', 'Emplacement'),
(10068, 10051, NULL, 'expense', '610033', '', 'Autres dépenses'),
(10069, 10052, NULL, 'expense', '610041', '', 'Entretien'),
(10070, 10052, NULL, 'expense', '610042', '', 'Emplacement'),
(10071, 10052, NULL, 'expense', '610043', '', 'Autres dépenses'),
(10072, 10053, NULL, 'expense', '610051', '', 'Taxe navigation'),
(10073, 10053, NULL, 'expense', '610052', '', 'Entretien'),
(10074, 10053, NULL, 'expense', '610053', '', 'Assurances'),
(10075, 10053, NULL, 'expense', '610054', '', 'Emplacement'),
(10076, 10053, NULL, 'expense', '610055', '', 'Transport'),
(10077, 10053, NULL, 'expense', '610056', '', 'Autres dépenses'),
(10078, 10054, NULL, 'expense', '610061', '', 'Taxe navigation'),
(10079, 10054, NULL, 'expense', '610062', '', 'Entretien'),
(10080, 10054, NULL, 'expense', '610063', '', 'Assurances'),
(10081, 10054, NULL, 'expense', '610064', '', 'Emplacement'),
(10082, 10054, NULL, 'expense', '610065', '', 'Transport'),
(10083, 10054, NULL, 'expense', '610066', '', 'Inspection'),
(10084, 10054, NULL, 'expense', '610067', '', 'Autres dépenses'),
(10085, 10021, NULL, 'expense', '65001', '', 'Photocopies'),
(10086, 10021, NULL, 'expense', '65002', '', 'Envois timbres'),
(10087, 10021, NULL, 'expense', '65003', '', 'Frais bancaires'),
(10088, 10021, NULL, 'expense', '65004', '', 'AG'),
(10089, 10021, NULL, 'expense', '65005', '', 'Journée travail'),
(10090, 10021, NULL, 'expense', '65006', '', 'Séance accueil'),
(10091, 10021, NULL, 'expense', '65007', '', 'Travail pour le club'),
(10092, 10021, NULL, 'expense', '65008', '', 'Comité'),
(10093, 10021, NULL, 'expense', '65009', '', 'Divers'),
(10094, 10011, 1000, 'liability', '20300001', '', 'Administrator'),
(10095, 10011, 1001, 'liability', '20300002', '', 'Responsable'),
(10096, 10011, 1002, 'liability', '20300003', '', 'Active Member'),
(10097, 10011, 1007, 'liability', '20300004', '', 'Conjoint'),
(10098, 10011, 1010, 'liability', '20300007', '', 'Voilier Member'),
(10099, 10011, 1011, 'liability', '20300008', '', 'Voilier Family'),
(10100, 10007, NULL, 'expense', '8000', '', 'Charges hors exploitation'),
(10101, 10007, NULL, 'revenue', '8100', '', 'Produits hors exploitation'),
(10102, 10007, NULL, 'expense', '8500', '', 'Charges extraordinaires, exceptionnelles ou hors période'),
(10103, 10007, NULL, 'revenue', '8510', '', 'Produits extraordinaires, exceptionnels ou hors période');

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

REPLACE INTO image (id, filename, width, height) VALUES
(5000, 'chat1.jpg', 1000, 482),
(5001, 'chat2.jpg', 1024, 680),
(5002, 'chat3.jpg', 625, 768),
(5003, 'chat4.jpg', 767, 767),
(5004, 'chat5.jpg', 1144, 899),
(5005, 'chat6.jpg', 630, 330),
(5006, 'chat7.jpg', 820, 457),
(5007, 'chat8.jpg', 1000, 1000);

REPLACE INTO bookable (id, image_id, periodic_price, initial_price, name, code, booking_type, description) VALUES
(3000, 5000, 0, 0, 'Stand up S1 (3000, carnet de sortie, occupé)', 'S1', 'self_approved', 'No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 5001, 0, 0, 'Canoe C1 (3001, carnet de sortie, occupé)', 'C1', 'self_approved', 'La marche des vertueux est semée d’obstacles qui sont les entreprises égoïstes que fait sans fin, surgir l’œuvre du malin. Béni soit-il l’homme de bonne volonté qui, au nom de la charité se fait le berger des faibles qu’il guide dans la vallée d’ombre de la mort et des larmes, car il est le gardien de son frère et la providence des enfants égarés. J’abattrai alors le bras d’une terrible colère, d’une vengeance furieuse et effrayante sur les hordes impies qui pourchassent et réduisent à néant les brebis de Dieu. Et tu connaîtras pourquoi mon nom est l’éternel quand sur toi, s’abattra la vengeance du Tout-Puissant !'),
(3002, NULL, 10, 0, 'Casier virtuel (3002, sur demande, periodic)', 'casier', 'admin_approved', 'Pour demande de stockage. '),
(3003, NULL, 10, 0, 'Casier 1012 (3003, inventaire / spécifique admin, periodic)', 'CA1012', 'admin_only', 'Casier XYZ. '),
(3004, NULL, 20, 0, 'Membre NFT (3004, inventaire / spécifique admin, periodic)', 'e', 'admin_approved', 'Service supplémentaire. '),
(3005, NULL, 0, 10, 'Frais ouverture (3005, obligatoire, initial)', 'f', 'mandatory', 'Pour adhésion et cotisation.'),
(3006, NULL, 90, 0, 'Cotisation (3006, obligatoire, periodic)', 'g', 'mandatory', 'Pour adhésion et cotisation. '),
(3007, 5002, 0, 0, 'Voilier V1 (3007, carnet de sortie, avec certification, occupé)', 'V1', 'self_approved', 'Pour carnet de sortie, mais avec certification, et avec une description assez courte'),
(3008, 5003, 0, 0, 'Voilier V2 (3008, carnet de sortie, avec certification, libre)', 'V2', 'self_approved', 'Tiens, ça me rappelle une blague : c’est un mec qui arrive dans un bar et va trouver le barman, et il dit « Barman, je vais faire un pari avec vous, je pari avec vous 300$ que j’arrive à pisser dans le verre qui est là bas sans en mettre une seule goutte à coté ». Le barman regarde, et en fait on parle d’un verre qui est au moins à 3 mètres et il dit « Minute vous êtes sur que vous voulez parier avec moi 300$ que vous arriverez à pisser de là où vous êtes en plein dans le verre au bout du comptoir et sans en mettre à coté ? » Et là le type dit au barman « Absolument » et le barman lui dit « ça marche je tiens le pari » et l’autre dit « Ok en avant toute ! », il sort son engin et là il regarde le verre et il pense au verre et à sa bite aussi « bite verre, bite verre, verre bite, verre bite » et là il ouvre les vannes, et il pisse sur tout ce qui bouge le mec. Il pisse sur le bar, il pisse sur tous les tabourets, sur le plancher, sur le téléphone, sur le barman, il pisse à l’ouest et à l’est le gars, excepté dans ce verre à la con. Alors le barman il est carrément mort de rire de se faire 300$ comme ça « Ah ah ah ah » le mec dégoulinant de pisse et il dit à l’autre « Enfoiré t’es carrément débile, t’as réussi à pisser partout excepté dans le verre et maintenant mon pote tu me dois 300$ » et le mec fait « Excusez moi, bougez pas, je reviens ». Y a deux mecs au billard, et ils se font ne partie depuis une bonne demi heure, il va les voir et « blablabla » il revient au bar et il fait « Voilà M. le barman 300 » et le barman genre « Enfoiré rigole pas comme ça tu viens de perdre 300$ connard » et le mec lui fait « Et ben vous voyez ces types là ? On a fait un pari ensemble : j’ai parié 500$ à chaque mec que j’arriverai à pisser sur votre bar, pisser sur vot’ plancher, à pisser sur votre téléphone, à pisser sur vous, et que non seulement vous n’auriez pas envie de me démolir mais que ça vous f’rai marrer ».'),
(3009, 5004, 0, 0, 'Planche à voile PAV1 (3009, carnet de sortie, libre)', 'PAV1', 'self_approved', 'Si vous lisez ceci, alors cet avertissement est pour vous. Chaque mot que vous lisez de ce texte inutile est une autre seconde perdue dans votre vie. N’avez-vous rien d’autre à faire ? Votre vie est-elle si vide que, honnêtement, vous ne puissiez penser à une meilleure manière de passer ces moments ? Ou êtes-vous si impressionné par l’autorité que vous donnez votre respect et vouez votre foi à tous ceux qui s’en réclament ? Lisez-vous tout ce que vous êtes supposés lire ? Pensez-vous tout ce que vous êtes supposés penser ? Achetez-vous ce que l’on vous dit d’acheter ? Sortez de votre appartement. Allez à la rencontre du sexe opposé. Arrêtez le shopping excessif et la masturbation. Quittez votre travail. Commencez à vous battre. Prouvez que vous êtes en vie. Si vous ne revendiquez pas votre humanité, vous deviendrez une statistique. Vous êtes prévenu...'),
(3010, 5005, 0, 0, 'Rame R1 (3010, carnet de sortie, libre)', 'R1', 'self_approved', 'Ça pose toujours un problème de soulever un corps en un seul morceau. Apparemment, la meilleure façon de procéder est de découper le corps en 6 morceaux et de les mettre en tas. Une fois que vous avez vos 6 morceaux il faut vous en défaire rapidement parce que votre maman ne serait peut-être pas contente de les trouver dans le congélateur. Il semble que la meilleure façon soit de nourrir les porcs avec. Il faut les mettre à la diète quelques jours. Pour un porc affamé des morceaux de cadavre c’est du coq au vin pour un poivrot. Vous devez raser la tête de vos victimes et leur arracher les dents. Ce sont les seules choses que les porcs ne digèrent pas. Vous pourriez les récupérer après bien sûr mais vous n’avez pas envi de fouiller dans la merde de cochon je suppose. Ils dévorent les os comme du beurre. Il vous faut au moins 16 porcs pour finir le travail en un seule fois. Aussi je vous conseille de vous méfier des types qui élèvent les porcs parce que ces bestiaux sont capables de venir à bout d’un cadavre de 100kg en moins de 8 minutes, ce qui veut dire qu’un porc peut engloutir, en moyenne, un kilo de viande toute les minutes. D’où l’expression se goinfrer comme un porc.'),
(3011, 5006, 0, 0, 'Dériveur D1 (3011, carnet de sortie, occupé)', 'D1', 'self_approved', 'Personne ne panique quand tout se déroule selon le plan. Et ceci même si le plan est affreux. Si demain soir je dis à la presse que, un brigand va se faire descendre ou qu’un fourgon chargé de soldat va exploser... personne ne panique. Parce que tout ça, ça fait parti du plan. Mais si je dis qu’un, malheureux petit maire va mourir. Alors là... tout le monde s’affole ! On entrouvre la porte à l’anarchie, on bouscule l’ordre établi et très vite le chaos le plus total règne. Et moi j’annonce le chaos... et tu sais ce qu’il a pour lui le chaos ? ... Il est impartial !.'),
(3012, 5007, 0, 0, 'Kayak K1 (3012, carnet de sortie, libre)', 'K1', 'self_approved', 'Vous savez, moi je ne crois pas qu’il y ait de bonne ou de mauvaise situation. Moi, si je devais résumer ma vie aujourd’hui avec vous, je dirais que c’est d’abord des rencontres. Des gens qui m’ont tendu la main, peut-être à un moment où je ne pouvais pas, où j’étais seul chez moi. Et c’est assez curieux de se dire que les hasards, les rencontres forgent une destinée... Parce que quand on a le goût de la chose, quand on a le goût de la chose bien faite, le beau geste, parfois on ne trouve pas l’interlocuteur en face je dirais, le miroir qui vous aide à avancer. Alors ça n’est pas mon cas, comme je disais là, puisque moi au contraire, j’ai pu : et je dis merci à la vie, je lui dis merci, je chante la vie, je danse la vie... je ne suis qu’amour ! Et finalement, quand beaucoup de gens aujourd’hui me disent « Mais comment fais-tu pour avoir cette humanité ? », et bien je leur réponds très simplement, je leur dis que c’est ce goût de l’amour ce goût donc qui m’a poussé aujourd’hui à entreprendre une construction mécanique, mais demain qui sait ? Peut-être simplement à me mettre au service de la communauté, à faire le don, le don de soi...');

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
(6005, 3008),
(6003, 3012),
(6006, 3007),
(6006, 3008),
(6005, 3011),
(6005, 3009);

REPLACE INTO booking (id, owner_id, status, start_date, end_date, estimated_end_date, destination, start_comment) VALUE
(4000, 1002, 'booked', '2018-01-01 14:15:00', '2018-01-01 18:21:43', '18h', 'Zamora', 'There comes a time, thief, when the jewels cease to sparkle, when the gold loses its luster, when the throne room becomes a prison, and all that is left is a father''s love for his child.'),
(4001, 1002, 'booked', '2018-01-02 13:32:51', NULL, '21 oct 2015', 'Twin Pines Mall', 'Where we go we don''t need roads'),
(4003, 1002, 'application', '2018-01-02 13:32:51', NULL, '', '', ''),
(4004, 1002, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4005, 1002, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4006, 1002, 'application', '2018-01-02 13:32:51', NULL, '', '', ''),
(4007, 1005, 'booked', '2018-01-02 13:32:51', NULL, '', '', ''),
(4009, 1002, 'booked', '2018-01-02 13:32:51', NULL, 'Judgment day', 'Skynet bunker', 'Nulla vitae elit libero, a pharetra augue.'),
(4012, 1008, 'booked', '2018-01-02 13:32:51', NULL, '29 sept 3021', 'Not middle earth', 'Soron is gone');

-- Only a bookable by booking
REPLACE INTO booking_bookable (booking_id, bookable_id) VALUES
(4000, 3000),
(4001, 3001),
(4003, 3002),
(4004, 3003),
(4005, 3006),
(4006, 3004),
(4007, 3006),
(4012, 3011);

REPLACE INTO expense_claim (id, creation_date, owner_id, amount, status, name, description, remarks) VALUES
(7000, '2019-01-10', 1002, 200.00, 'new', 'achats Jumbo', 'outils pour voilier', ''),
(7001, '2019-01-14', 1002, 100.00, 'processed', 'flyers', 'Cighelio', ''),
(7002, '2019-03-14', 1002, -50.00, 'processing', 'remboursement bancaire', '', '');

REPLACE INTO transaction (id, transactionDate, name, remarks, expense_claim_id) VALUES
(8000, '2019-03-01', 'Active Member: inscription cours nautique', '', NULL),
(8001, '2019-03-10', 'Photocopies pour comité', '', NULL),
(8002, '2019-03-12', 'Cotisation 2019', '', NULL),
(8003, '2019-01-15', 'Remboursement flyers pour cours nautique', 'Facture Cighelio du 10.01.2019', 7001),
(8004, '2019-02-05', 'Location casier 1012', '', NULL),
(8005, '2019-02-04', 'Achat d''un nouveau voilier', 'Paiement partiel par banque et poste', NULL);

REPLACE INTO transaction_tag (id, name) VALUES
(15000, 'Régate 2019'),
(15001, 'Cours 2019'),
(15002, 'Tombola 2019'),
(15003, 'Camp J+S 2019'),
(15004, 'Camp France 2019'),
(15005, 'Semaine nautique 2019');

REPLACE INTO transaction_line (id, transaction_id, debit_id, credit_id, bookable_id, transaction_tag_id, balance, transactionDate, is_reconciled, name, remarks) VALUES
(14000, 8000, 10096, 10037, NULL, 15001, 100.00, '2019-03-01', 1, 'Paiement depuis crédit MyIchtus', ''),
(14001, 8001, 10085, 10025, NULL, NULL, 12.50, '2019-03-10', 1, 'Paiement par Postcard', ''),
(14002, 8002, 10096, 10035, NULL, NULL, 90.00, '2019-03-12', 1, 'Paiement depuis crédit MyIchtus', ''),
(14003, 8003, 10022, 10096, NULL, 15001, 100, '2019-03-15', 1, 'Remboursement sur crédit MyIchtus', ''),
(14004, 8004, 10096, 10036, 3003, NULL, 50, '2019-02-05', 1, 'Paiement depuis crédit MyIchtus', ''),
(14005, 8005, 10054, NULL, 3007, NULL, 10000, '2019-02-03', 1, 'Acquisition voilier NE123456', ''),
(14006, 8005, NULL, 10025, NULL, NULL, 7000, '2019-02-03', 1, 'Paiement par PostFinance', ''),
(14007, 8005, NULL, 10026, NULL, NULL, 3000, '2019-02-04', 0, 'Paiement par Raiffeisen', '');

REPLACE INTO accounting_document (id, expense_claim_id, filename, mime) VALUES
(9000, 7000,'dw4jV3zYSPsqE2CB8BcP8ABD0.pdf', 'application/pdf');

REPLACE INTO message (id, creator_id, owner_id, recipient_id, type, date_sent, email, subject, body) VALUES
(11001, 1000, 1000, 1002, 'monthly_reminder', '2019-01-01 12:00:00','member@example.com', 'Avertissement de crédit négatif', 'Bonjour, nous vous informons que votre compte Ichtus présente un solde négatif'),
(11002, 1001, 1001, 1005, 'yearly_reminder', NULL,'inactive@example.com', 'Nettoyage local', 'Bonjour, nous vous invitons à venir nous aider pour le nettoyage de printemps du local');

REPLACE INTO user_tag (id, creator_id, owner_id, name, color) VALUES
(12000, 1000, 1000, 'Moniteur voile', '#0000FF'),
(12001, 1000, 1000, 'Moniteur SUP', '#FF0000');

REPLACE INTO user_tag_user (user_tag_id, user_id) VALUES
(12000, 1008),
(12001, 1009);

REPLACE INTO bookable_metadata (id, bookable_id, name, value) VALUES
(13000, 3000, 'Largeur', '1405 mm'),
(13001, 3000, 'Hauteur', '1605 mm');

COMMIT;

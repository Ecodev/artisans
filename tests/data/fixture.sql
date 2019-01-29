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
(3000, 0, 0, 'Stand up S1 (3000, carnet de sortie, occupé)', 'S1', 'self_approved', 'No, no, no, no. You gotta listen to the way people talk. You don''t say "affirmative," or some shit like that. You say "no problemo." And if someone comes on to you with an attitude you say "eat me." And if you want to shine them on it''s "hasta la vista, baby."'),
(3001, 0, 0, 'Canoe C1 (3001, carnet de sortie, occupé)', 'C1', 'self_approved', 'La marche des vertueux est semée d’obstacles qui sont les entreprises égoïstes que fait sans fin, surgir l’œuvre du malin. Béni soit-il l’homme de bonne volonté qui, au nom de la charité se fait le berger des faibles qu’il guide dans la vallée d’ombre de la mort et des larmes, car il est le gardien de son frère et la providence des enfants égarés. J’abattrai alors le bras d’une terrible colère, d’une vengeance furieuse et effrayante sur les hordes impies qui pourchassent et réduisent à néant les brebis de Dieu. Et tu connaîtras pourquoi mon nom est l’éternel quand sur toi, s’abattra la vengeance du Tout-Puissant !'),
(3002, 10, 0, 'Casier virtuel (3002, sur demande, periodic)', 'casier', 'admin_approved', 'Pour demande de stockage. '),
(3003, 10, 0, 'Casier 1012 (3003, inventaire / spécifique admin, periodic)', 'CA1012', 'admin_only', 'Casier XYZ. '),
(3004, 20, 0, 'Membre NFT (3004, inventaire / spécifique admin, periodic)', 'e', 'admin_approved', 'Service supplémentaire. '),
(3005, 0, 10, 'Frais ouverture (3005, obligatoire, initial)', 'f', 'mandatory', 'Pour adhésion et cotisation.'),
(3006, 90, 0, 'Cotisation (3006, obligatoire, periodic)', 'g', 'mandatory', 'Pour adhésion et cotisation. '),
(3007, 0, 0, 'Voilier V1 (3007, carnet de sortie, avec certification, occupé)', 'V1', 'self_approved', 'Pour carnet de sortie, mais avec certification, et avec une description assez courte'),
(3008, 0, 0, 'Voilier V2 (3008, carnet de sortie, avec certification, libre)', 'V2', 'self_approved', 'Tiens, ça me rappelle une blague : c’est un mec qui arrive dans un bar et va trouver le barman, et il dit « Barman, je vais faire un pari avec vous, je pari avec vous 300$ que j’arrive à pisser dans le verre qui est là bas sans en mettre une seule goutte à coté ». Le barman regarde, et en fait on parle d’un verre qui est au moins à 3 mètres et il dit « Minute vous êtes sur que vous voulez parier avec moi 300$ que vous arriverez à pisser de là où vous êtes en plein dans le verre au bout du comptoir et sans en mettre à coté ? » Et là le type dit au barman « Absolument » et le barman lui dit « ça marche je tiens le pari » et l’autre dit « Ok en avant toute ! », il sort son engin et là il regarde le verre et il pense au verre et à sa bite aussi « bite verre, bite verre, verre bite, verre bite » et là il ouvre les vannes, et il pisse sur tout ce qui bouge le mec. Il pisse sur le bar, il pisse sur tous les tabourets, sur le plancher, sur le téléphone, sur le barman, il pisse à l’ouest et à l’est le gars, excepté dans ce verre à la con. Alors le barman il est carrément mort de rire de se faire 300$ comme ça « Ah ah ah ah » le mec dégoulinant de pisse et il dit à l’autre « Enfoiré t’es carrément débile, t’as réussi à pisser partout excepté dans le verre et maintenant mon pote tu me dois 300$ » et le mec fait « Excusez moi, bougez pas, je reviens ». Y a deux mecs au billard, et ils se font ne partie depuis une bonne demi heure, il va les voir et « blablabla » il revient au bar et il fait « Voilà M. le barman 300 » et le barman genre « Enfoiré rigole pas comme ça tu viens de perdre 300$ connard » et le mec lui fait « Et ben vous voyez ces types là ? On a fait un pari ensemble : j’ai parié 500$ à chaque mec que j’arriverai à pisser sur votre bar, pisser sur vot’ plancher, à pisser sur votre téléphone, à pisser sur vous, et que non seulement vous n’auriez pas envie de me démolir mais que ça vous f’rai marrer ».'),
(3009, 0, 0, 'Planche à voile PAV1 (3009, carnet de sortie, libre)', 'PAV1', 'self_approved', 'Si vous lisez ceci, alors cet avertissement est pour vous. Chaque mot que vous lisez de ce texte inutile est une autre seconde perdue dans votre vie. N’avez-vous rien d’autre à faire ? Votre vie est-elle si vide que, honnêtement, vous ne puissiez penser à une meilleure manière de passer ces moments ? Ou êtes-vous si impressionné par l’autorité que vous donnez votre respect et vouez votre foi à tous ceux qui s’en réclament ? Lisez-vous tout ce que vous êtes supposés lire ? Pensez-vous tout ce que vous êtes supposés penser ? Achetez-vous ce que l’on vous dit d’acheter ? Sortez de votre appartement. Allez à la rencontre du sexe opposé. Arrêtez le shopping excessif et la masturbation. Quittez votre travail. Commencez à vous battre. Prouvez que vous êtes en vie. Si vous ne revendiquez pas votre humanité, vous deviendrez une statistique. Vous êtes prévenu...'),
(3010, 0, 0, 'Rame R1 (3010, carnet de sortie, libre)', 'R1', 'self_approved', 'Ça pose toujours un problème de soulever un corps en un seul morceau. Apparemment, la meilleure façon de procéder est de découper le corps en 6 morceaux et de les mettre en tas. Une fois que vous avez vos 6 morceaux il faut vous en défaire rapidement parce que votre maman ne serait peut-être pas contente de les trouver dans le congélateur. Il semble que la meilleure façon soit de nourrir les porcs avec. Il faut les mettre à la diète quelques jours. Pour un porc affamé des morceaux de cadavre c’est du coq au vin pour un poivrot. Vous devez raser la tête de vos victimes et leur arracher les dents. Ce sont les seules choses que les porcs ne digèrent pas. Vous pourriez les récupérer après bien sûr mais vous n’avez pas envi de fouiller dans la merde de cochon je suppose. Ils dévorent les os comme du beurre. Il vous faut au moins 16 porcs pour finir le travail en un seule fois. Aussi je vous conseille de vous méfier des types qui élèvent les porcs parce que ces bestiaux sont capables de venir à bout d’un cadavre de 100kg en moins de 8 minutes, ce qui veut dire qu’un porc peut engloutir, en moyenne, un kilo de viande toute les minutes. D’où l’expression se goinfrer comme un porc.'),
(3011, 0, 0, 'Dériveur D1 (3011, carnet de sortie, libre)', 'D1', 'self_approved', 'Personne ne panique quand tout se déroule selon le plan. Et ceci même si le plan est affreux. Si demain soir je dis à la presse que, un brigand va se faire descendre ou qu’un fourgon chargé de soldat va exploser... personne ne panique. Parce que tout ça, ça fait parti du plan. Mais si je dis qu’un, malheureux petit maire va mourir. Alors là... tout le monde s’affole ! On entrouvre la porte à l’anarchie, on bouscule l’ordre établi et très vite le chaos le plus total règne. Et moi j’annonce le chaos... et tu sais ce qu’il a pour lui le chaos ? ... Il est impartial !.'),
(3012, 0, 0, 'Kayak K1 (3012, carnet de sortie, libre)', 'K1', 'self_approved', 'Vous savez, moi je ne crois pas qu’il y ait de bonne ou de mauvaise situation. Moi, si je devais résumer ma vie aujourd’hui avec vous, je dirais que c’est d’abord des rencontres. Des gens qui m’ont tendu la main, peut-être à un moment où je ne pouvais pas, où j’étais seul chez moi. Et c’est assez curieux de se dire que les hasards, les rencontres forgent une destinée... Parce que quand on a le goût de la chose, quand on a le goût de la chose bien faite, le beau geste, parfois on ne trouve pas l’interlocuteur en face je dirais, le miroir qui vous aide à avancer. Alors ça n’est pas mon cas, comme je disais là, puisque moi au contraire, j’ai pu : et je dis merci à la vie, je lui dis merci, je chante la vie, je danse la vie... je ne suis qu’amour ! Et finalement, quand beaucoup de gens aujourd’hui me disent « Mais comment fais-tu pour avoir cette humanité ? », et bien je leur réponds très simplement, je leur dis que c’est ce goût de l’amour ce goût donc qui m’a poussé aujourd’hui à entreprendre une construction mécanique, mais demain qui sait ? Peut-être simplement à me mettre au service de la communauté, à faire le don, le don de soi...');

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
(4001, 3001),
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

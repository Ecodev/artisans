START TRANSACTION;

SET sql_mode = 'STRICT_TRANS_TABLES';

REPLACE INTO user (id, owner_id, first_name, last_name, email, password, role, country_id) VALUES
(1000, NULL, 'Jack', 'Sparrow', 'administrator@example.com', MD5('administrator'), 'administrator', 1),
(1001, NULL, 'Will', 'Turner', 'facilitator@example.com', MD5('facilitator'), 'facilitator', 2),
(1002, NULL, 'Hector', 'Barbossa', 'member@example.com', MD5('member'), 'member', 1),
(1003, NULL, 'Elizabeth', 'Swann', 'othermember@example.com', MD5('othermember'), 'member', 1);

COMMIT;

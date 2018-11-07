START TRANSACTION;

REPLACE INTO `user`(`id`, `login`, `name`, `email`, `password`, role) VALUES
(1000, 'administrator', 'administrator', 'administrator@example.com', MD5('administrator'), 'administrator'),
(1001, 'member', 'member', 'member@example.com', MD5('member'), 'member');

REPLACE INTO `tag`(`id`, `name`) VALUES
(2000, 'Test tag 2000');

COMMIT;

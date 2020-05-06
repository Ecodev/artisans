-- This script will migrate from the old data structure to the new one.
-- It assumes that old tables and new tables are in the same database, side-by-side.
-- New tables must already exists and be up-to-date.
--
-- A quick way to ensure all those assumptions and do the migration are the following commands:
--
--     ./vendor/bin/doctrine-migrations migrations:migrate --no-interaction
--     gunzip -c data/cache/larevuedurable.com.sql.gz | mysql -u artisans -p artisans
--     more bin/migrate_larevuedurable_data.sql | mysql -u artisans -p artisans
--     ./bin/clean-formatted-content.php
--
-- Files can be migrated with something like the following. It will only copy the original image, no thumbs, into current project:
--
--     find /sites/larevuedurable.com/htdocs/img/p/ -regextype posix-extended -regex '.*/[0-9]+\..[a-zA-Z]+' -exec cp {} data/images/ \;
--     cp /sites/larevuedurable.lan/htdocs/download/* data/file/ && rm data/file/index.php
--
-- Later on things can be cleaned up with the help of `./bin/check-files.php`

START TRANSACTION;

INSERT INTO user (id, creation_date, update_date, first_name, last_name, password, email, role)
SELECT id_customer,
    date_add,
    date_upd,
    CONCAT(UCASE(LEFT(firstname, 1)), SUBSTRING(firstname, 2)),
    CONCAT(UCASE(LEFT(lastname, 1)), SUBSTRING(lastname, 2)),
    passwd,
    email,
    'member'
FROM ps_customer
WHERE deleted = 0;

-- Assume all image exist on disks
INSERT INTO image (id, filename, mime, width, height)
SELECT id_image,
    CONCAT(id_image, '.jpg'),
    'image/jpeg',
    0,
    0
FROM ps_image;

-- PrestaShop have duplicated records for same file on disk, so we use `IGNORE`
INSERT IGNORE INTO file (id, creation_date, filename, mime)
SELECT id_product_download,
    date_add,
    filename,
    IF(filename IN (
                    '0513b4a3334d06950593bd573d32be875a672c72',
                    '13b08fe77934d106f1a6079dccd34c40f8314aff',
                    '180ef3e990772da08289d0e7b1ff7e11bd80876b',
                    '2e5d8f40fbeb61de8b6a7ad551f0241eac20c3bc',
                    '41854fe4dfd4b4b4352bbd2e81a0869f72ab9c4a',
                    '8d55eab43fd082ce45f39a233f3bf5724777fecf',
                    '96a3082aa6f3b5f6f9268e407dbc19bd113012f0'
        ), 'application/zip',
       IF(filename IN (
                       '0a04fafaf1e018ee2df33e09eac5d91cebc483f5',
                       '0faed7343c23a920e5d30fdfd5e37f23e7c75266',
                       '16581c333db02986c069b72cfe99f87c4e95cbfe',
                       '1b88743a5baab4188b8b70f9637a7114f0d3edc6',
                       '3ad53052f54e424bbd6e535c2a0959497c914fb1',
                       '53394d663ecc3fab39793ab374c905f1d1fc6288',
                       '638ed359ac9c9aaea2bad5fee462aedfc2f81d2b',
                       '795f67656775c0a7349ccf7ea7e3a08ddd048cb2',
                       '8a944e5102f68ee245b02f88bad4cd4c878bf0b7',
                       'b165731bcf4464f2e061257ad0fcfeac4994e2ce',
                       'f37fcbdfe367fd418a600c196c969e816261b502'
           ), 'image/png',
          'application/pdf'))
FROM ps_product_download;

-- Manual fix for a few references
UPDATE ps_product
SET reference = REPLACE(
        REPLACE(
                REPLACE(
                        REPLACE(
                                REPLACE(
                                        REPLACE(reference, '053-16', '053-016'),
                                        '058-17', '058-017'),
                                '058-46', '058-046'),
                        '061- 003', '061-003'),
                '061-62', '061-062'),
        '062- 003', '062-003');

INSERT INTO product (id, image_id, creation_date, update_date, price_per_unit_chf, price_per_unit_eur, name,
                     content, code, internal_remarks, type, description, is_active, reading_duration,
                     release_date, review_number)
SELECT ps_product.id_product,
    pi.id_image, -- Assume the image exists on disk
    ps_product.date_add,
    ps_product.date_upd,
    (ps_product.price + ps_product.price * 0.025) * 100, -- Compute CHF price including tax
        (ROUND((ps_product.price + ps_product.price * 0.025) * 0.73 * 4) / 4) * 100, -- Compute EUR price including tax
    REPLACE(ppl.name, ' (version papier)', ''),
    IFNULL(ppl.description, ''),
    IF(ps_product.reference = '', NULL, ps_product.reference),
    '',
    IF(reference REGEXP '^\\d\\d\\d$', 'both', -- Reviews are both
       IF(reference REGEXP '^\\d\\d\\d-\\d\\d\\d$', 'digital', -- Articles are digital only
          'other') -- Anything else ("Vignette cuisine")
        ),
    IFNULL(ppl.description_short, ''),
    ps_product.active,
    NULL, -- This information did not exist before
    ps_product.date_parution,
    IF(reference REGEXP '^\\d\\d\\d$', ps_product.reference, NULL) -- Only reviews have a review_number, articles don't
FROM ps_product
         INNER JOIN ps_product_lang AS ppl ON ps_product.id_product = ppl.id_product AND ppl.id_lang = 1
         LEFT JOIN ps_image pi ON ppl.id_product = pi.id_product AND pi.cover = 1
WHERE ps_product.reference NOT REGEXP '^\\d\\d\\de$' -- Never import digital review, instead we will import paper and mark it as `both`
        AND ps_product.reference NOT LIKE 'abo-%' -- Skip subscriptions because they have their own table
        AND
        ps_product.id_product NOT IN (
                                      1258, -- Because it is a duplicate of 83 with both the reference 045-061 and this one is not active
                                      782, -- Exclude all "Recharge"
                                      783,
                                      784,
                                      785,
                                      786,
                                      1024, -- accessible qu'à la recherche, pas importer car on n'a pas ce type de mécanisme
                                      1025,
                                      1026,
                                      1027,
                                      1028, -- plus de bons cadeaux, ca passera par un contact direct avec eux
                                      1083, -- semble être un doublon, ne pas importer
                                      1143, -- n'est plus un produit, mais une feature, ne pas importer
                                      1236, -- ne pas importer
                                      1142 -- la cotisation est déjà un produit chez nous. Ce produit n'est donc à priori pas à importer, car l'ajout au panier se fera par ID hardcodé comme pour les abonnements
        )
;

-- Link articles to their reviews
UPDATE product
    INNER JOIN ps_product AS article ON article.id_product = product.id
    INNER JOIN ps_product AS review ON review.reference REGEXP '^\\d\\d\\d$' AND article.numero = review.reference
SET product.review_id = review.id_product
WHERE article.reference REGEXP '^\\d\\d\\d-\\d\\d\\d$' -- Only articles
;

-- Link products to their PDF
-- Here we must join on filename, because some ID are missing in our DB because of duplicated records in PrestaShop
UPDATE product
    INNER JOIN ps_product_download ppd ON product.id = ppd.id_product
    INNER JOIN file ON file.filename = ppd.filename
SET product.file_id = file.id;


INSERT INTO `order` (id, creator_id, owner_id, updater_id, creation_date, update_date, balance_chf, balance_eur, status,
                     payment_method, internal_remarks)
SELECT id_order,
    NULL,
    id_customer,
    NULL,
    date_add,
    date_upd,
    IF(id_currency = 1, total_products_wt, 0) * 100,
    IF(id_currency = 2, total_products_wt, 0) * 100,
    IF(ps_orders.valid, 'validated', 'pending'),
    CASE module
        WHEN 'bankwire'
            THEN 'ebanking'
        WHEN 'bankwirebvr'
            THEN 'bvr'
        WHEN 'datatrans'
            THEN 'datatrans'
        ELSE -- Assume everything else (cheque, free_order, prepayment) is ebanking. This is a loss of data, but should be acceptable
            'ebanking'
        END,
    CONCAT('Référence selon PrestaShop: ', reference)
FROM ps_orders
WHERE id_customer IN (SELECT id FROM user);

INSERT INTO order_line (id, owner_id, creation_date, update_date, order_id, name, is_chf, balance_chf, balance_eur,
                        type, product_id, subscription_id, quantity)
SELECT id_order_detail,
    ps_orders.id_customer,
    ps_orders.date_add,
    ps_orders.date_upd,
    ps_orders.id_order,
    ps_order_detail.product_name,
    ps_orders.id_currency = 1,
        IF(ps_orders.id_currency = 1, ps_order_detail.total_price_tax_incl, 0) * 100,
        IF(ps_orders.id_currency = 2, ps_order_detail.total_price_tax_incl, 0) * 100,
    'both',
    IF(ps_order_detail.product_id IN (SELECT id FROM product), ps_order_detail.product_id, NULL),
    NULL, -- Subscriptions are never migrated so cannot be linked
    ps_order_detail.product_quantity
FROM ps_order_detail
         INNER JOIN ps_orders ON
        ps_order_detail.id_order = ps_orders.id_order
        AND ps_orders.id_customer IN (SELECT id FROM user);

-- Only import used categories
INSERT IGNORE INTO product_tag(id, creation_date, update_date, name, color)
SELECT ps_category.id_category,
    ps_category.date_add,
    ps_category.date_upd,
    ps_category_lang.name,
    '#f6a990'
FROM ps_category
         INNER JOIN ps_category_lang ON ps_category_lang.id_category = ps_category.id_category
         INNER JOIN ps_category_product ON
        ps_category_lang.id_category = ps_category_product.id_category AND
        ps_category_product.id_product IN (SELECT id FROM product)
WHERE id_lang = 1 AND ps_category.id_parent = 6;

INSERT INTO product_tag_product (product_tag_id, product_id)
SELECT id_category,
    id_product
FROM ps_category_product
WHERE id_product IN (SELECT id FROM product) AND id_category IN (SELECT id FROM product_tag);


-- Employee that already exists as customer are promoted to admin
UPDATE user
SET role = 'administrator'
WHERE email IN (SELECT email FROM ps_employee);

-- Insert new employee as users
INSERT INTO user (first_name, last_name, password, email, role)
SELECT lastname,
    firstname,
    passwd,
    email,

    CASE id_profile
        WHEN 1 -- SuperAdmin
            THEN 'administrator'
        WHEN 2 -- Administrateur
            THEN 'administrator'
        WHEN 5 -- Commercial
            THEN 'facilitator'
        WHEN 6 -- Administrateur LRD
            THEN 'facilitator'
        WHEN 7 -- Membre LRD
            THEN 'facilitator'
        ELSE -- Assume everything else is member (it should not happen)
            'member'
        END
FROM ps_employee
WHERE email NOT IN (SELECT email FROM user);

INSERT IGNORE INTO product_product (product_source, product_target)
SELECT id_product_1,
    id_product_2
FROM ps_accessory;

-- Migrate into news everything not in category "Agenda"
INSERT INTO news (id, name, description, content, date, is_active)
SELECT ps_prestablog_news.id_prestablog_news,
    ppnl.title,
    ppnl.paragraph,
    ppnl.content,
    ps_prestablog_news.date,
    ps_prestablog_news.actif
FROM ps_prestablog_news
         INNER JOIN ps_prestablog_news_lang ppnl
ON ps_prestablog_news.id_prestablog_news = ppnl.id_prestablog_news
    AND ppnl.id_lang = 1
WHERE ps_prestablog_news.id_prestablog_news NOT IN
      (SELECT news FROM ps_prestablog_correspondancecategorie WHERE categorie = 3);

-- Migrate category "Agenda" into event, but with loss of data, because our model is simpler
INSERT INTO event (id, name, date, type, place)
SELECT ps_prestablog_news.id_prestablog_news,
    ppnl.title,
    ps_prestablog_news.date,
    '',
    ''
FROM ps_prestablog_news
         INNER JOIN ps_prestablog_news_lang ppnl
ON ps_prestablog_news.id_prestablog_news = ppnl.id_prestablog_news
    AND ppnl.id_lang = 1
WHERE ps_prestablog_news.id_prestablog_news IN
      (SELECT news FROM ps_prestablog_correspondancecategorie WHERE categorie = 3);

INSERT INTO subscription (id, is_active, image_id, price_per_unit_chf, price_per_unit_eur, name, code, type,
                          description, internal_remarks)
VALUES (19000, 1, NULL, 5500, 4000, 'Abonnement standard papier', 'abo-papier', 'paper', 'CHANGE ME', ''),
(19001, 1, NULL, 8000, 5000, 'Abonnement standard numérique', 'abo-web', 'digital', 'CHANGE ME', ''),
(19002, 1, NULL, 10500, 7000, 'Abonnement standard papier et numérique', 'abo-web-papier', 'both', 'CHANGE ME', ''),
(19003, 1, NULL, 6500, 4500, 'Abonnement institutionnel papier', 'abo-pro-papier', 'paper', 'CHANGE ME', ''),
(19004, 1, NULL, 16000, 10000, 'Abonnement institutionnel numérique', 'abo-pro-web', 'digital', 'CHANGE ME', ''),
(19005, 1, NULL, 18500, 12000, 'Abonnement institutionnel papier et numérique', 'abo-pro-web-papier', 'both',
 'CHANGE ME', '');

-- Out of stock paper is only digital now
UPDATE product
SET type        = 'digital',
    description = REPLACE(
            REPLACE(description, '<p>La version papier est épuisée</p>', ''),
            '<p>La version papier est épuisée.  </p>', ''
        )
WHERE description LIKE '%La version papier est épuisée%';

-- Migrate one address per user, even if those data will be overwritten by cresus import after migration, it is useful for dev
UPDATE user
    INNER JOIN ps_address ON user.id = ps_address.id_customer
    INNER JOIN ps_country pc ON ps_address.id_country = pc.id_country
    INNER JOIN country ON country.code = pc.iso_code
SET user.street     = ps_address.address1,
    user.postcode   = ps_address.postcode,
    user.locality   = ps_address.city,
    user.country_id = country.id,
    user.phone      = IFNULL(IFNULL(ps_address.phone_mobile, ps_address.phone), '')
WHERE ps_address.deleted = 0
ORDER BY ps_address.date_upd;

COMMIT;

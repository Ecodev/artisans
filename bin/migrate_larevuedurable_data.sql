-- This script will migrate from the old data structure to the new one.
-- It assumes that old tables and new tables are in the same database, side-by-side.
-- New tables must already exists and be up-to-date.
--
-- A quick way to ensure all those assumptions and do the migration are the following commands:
--
--     ./vendor/bin/doctrine-migrations migrations:migrate --no-interaction
--     gunzip -c data/cache/larevuedurable.com.sql.gz | mysql -u artisans -p artisans
--     more bin/migrate_larevuedurable_data.sql | mysql -u artisans -p artisans
--
-- Files can be migrated with something like the following. It will only copy the original image, no thumbs, into current project:
--
--     find /sites/larevuedurable.com/htdocs/img/p/ -regextype posix-extended -regex '.*/[0-9]+\..[a-zA-Z]+' -exec cp {} data/images/ \;
--     cp /sites/larevuedurable.lan/htdocs/download/* data/file/ && rm data/file/index.php
--
-- Later on things can be cleaned up with the help of `./bin/check-files.php`

START TRANSACTION;

INSERT INTO user (id, creation_date, update_date, first_name, last_name, password, email, role, internal_remarks)
SELECT id_customer,
    date_add,
    date_upd,
    CONCAT(UCASE(LEFT(firstname, 1)), SUBSTRING(firstname, 2)),
    CONCAT(UCASE(LEFT(lastname, 1)), SUBSTRING(lastname, 2)),
    passwd,
    email,
    'member',
    CONCAT('Cresus ID selon PrestaShop: ', cresus_id)
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

INSERT INTO product (id, image_id, creation_date, update_date, price_per_unit_chf, price_per_unit_eur, name,
                     description, code, internal_remarks, type, short_description, is_active, reading_duration,
                     release_date, review_number)
SELECT ps_product.id_product,
    pi.id_image, -- Assume the image exists on disk
    ps_product.date_add,
    ps_product.date_upd,
    (ps_product.price + ps_product.price * 0.025) * 100, -- Compute CHF price including tax
    ((ps_product.price + ps_product.price * 0.025) * 100) * 1 / 1.36, -- Compute EUR price including tax
    REPLACE(ppl.name, ' (version papier)', ''),
    IFNULL(ppl.description, ''),
    IF(ps_product.reference = '', NULL, ps_product.reference),
    '',
    IF(reference REGEXP '^\\d\\d\\d$', 'both', -- Reviews are both
       IF(reference REGEXP '^\\d\\d\\d-\\d\\d\\d$', 'digital', -- Articles are digital only
          'paper') -- Anything else ("Vignette cuisine") is paper only
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
    ps_product.id_product != 1258 -- Because it is a duplicate of 83 with both the reference 045-061 and this one is not active
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


INSERT INTO subscription (id, image_id, creation_date, update_date, price_per_unit_chf, price_per_unit_eur, name,
                          description, code, internal_remarks, type, short_description, is_active)
SELECT ps_product.id_product,
    pi.id_image, -- Assume the image exists on disk
    ps_product.date_add,
    ps_product.date_upd,
    (ps_product.price + ps_product.price * 0.025) * 100, -- Compute CHF price including tax
    ((ps_product.price + ps_product.price * 0.025) * 100) * 1 / 1.36, -- Compute EUR price including tax
    ppl.name,
    IFNULL(ppl.description, ''),
    IF(ps_product.reference = '', NULL, ps_product.reference),
    '',
    'paper', -- I **think** all (existing) subscriptions are paper only
    IFNULL(ppl.description_short, ''),
    ps_product.active
FROM ps_product
         INNER JOIN ps_product_lang AS ppl ON ps_product.id_product = ppl.id_product AND ppl.id_lang = 1
         LEFT JOIN ps_image pi ON ppl.id_product = pi.id_product AND pi.cover = 1
WHERE ps_product.reference LIKE 'abo-%' -- Only subscriptions
;


INSERT INTO `order` (id, creator_id, owner_id, updater_id, creation_date, update_date, balance_chf, balance_eur, status,
                     payment_method, internal_remarks)
SELECT id_order,
    NULL,
    IF(id_customer IN (SELECT id FROM user), id_customer, NULL),
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
FROM ps_orders;

INSERT INTO order_line (id, owner_id, creation_date, update_date, order_id, name, is_chf, balance_chf, balance_eur,
                        type, product_id, subscription_id, quantity)
SELECT id_order_detail,
    IF(ps_orders.id_customer IN (SELECT id FROM user), ps_orders.id_customer, NULL),
    ps_orders.date_add,
    ps_orders.date_upd,
    ps_orders.id_order,
    ps_order_detail.product_name,
    ps_orders.id_currency = 1,
    IF(ps_orders.id_currency = 1, ps_order_detail.total_price_tax_incl, 0) * 100,
    IF(ps_orders.id_currency = 2, ps_order_detail.total_price_tax_incl, 0) * 100,
    'both',
    IF(ps_order_detail.product_id IN (SELECT id FROM product), ps_order_detail.product_id, NULL),
    IF(ps_order_detail.product_id IN (SELECT id FROM subscription), ps_order_detail.product_id, NULL),
    ps_order_detail.product_quantity
FROM ps_order_detail
         INNER JOIN ps_orders ON ps_order_detail.id_order = ps_orders.id_order;

COMMIT;

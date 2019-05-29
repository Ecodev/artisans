<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190529021621 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE `order` CHANGE vat_part vat_part INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\', CHANGE balance balance INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE order_line CHANGE vat_part vat_part INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\', CHANGE balance balance INT NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE transaction CHANGE balance balance INT UNSIGNED DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\'');

        // The following is an extremely convulated way to avoid doing a JOIN during the UPDATE to avoid https://jira.mariadb.org/browse/MDEV-19491
        $this->addSql('DROP FUNCTION IF EXISTS get_product_price;');
        $this->addSql('CREATE FUNCTION get_product_price(productId INT) RETURNS INT
BEGIN
    RETURN (SELECT product.price_per_unit FROM product WHERE product.id = productId LIMIT 1);
END
');

        $this->addSql('UPDATE order_line
SET order_line.balance = order_line.quantity * get_product_price(product_id) * order_line.price_ponderation
WHERE order_line.balance = 0 AND order_line.quantity != 0');

        $this->addSql('DROP FUNCTION IF EXISTS get_product_price;');
    }
}

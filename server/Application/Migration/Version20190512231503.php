<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190512231503 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('UPDATE product SET supplier_price = 100 * supplier_price, price_per_unit = 100 * price_per_unit');
        $this->addSql('UPDATE `order` SET balance = 100 * balance');
        $this->addSql('UPDATE account SET balance = 100 * balance');
        $this->addSql('UPDATE order_line SET balance = 100 * balance');
        $this->addSql('UPDATE transaction SET balance = 100 * balance');
        $this->addSql('UPDATE transaction_line SET balance = 100 * balance');
        $this->addSql('UPDATE expense_claim SET amount = 100 * amount');

        $this->addSql('ALTER TABLE product CHANGE supplier_price supplier_price INT UNSIGNED DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\', CHANGE price_per_unit price_per_unit INT DEFAULT 0.00 NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE `order` CHANGE balance balance INT UNSIGNED DEFAULT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE account CHANGE balance balance INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE order_line CHANGE balance balance INT UNSIGNED NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE transaction CHANGE balance balance INT UNSIGNED DEFAULT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE transaction_line CHANGE balance balance INT UNSIGNED NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE expense_claim CHANGE amount amount INT UNSIGNED NOT NULL COMMENT \'(DC2Type:Money)\'');
    }
}

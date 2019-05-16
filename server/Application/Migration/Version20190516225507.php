<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190516225507 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('UPDATE `order` SET vat_part = 100 * vat_part');
        $this->addSql('UPDATE order_line SET vat_part = 100 * vat_part');

        $this->addSql('ALTER TABLE `order` CHANGE vat_part vat_part INT UNSIGNED DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\'');
        $this->addSql('ALTER TABLE order_line CHANGE vat_part vat_part INT UNSIGNED DEFAULT 0 NOT NULL COMMENT \'(DC2Type:Money)\'');
    }
}

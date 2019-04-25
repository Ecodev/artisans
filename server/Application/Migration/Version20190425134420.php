<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190425134420 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE order_line CHANGE vat_part vat_part NUMERIC(10, 7) UNSIGNED DEFAULT \'0.0000000\' NOT NULL');
        $this->addSql('ALTER TABLE transaction ADD balance NUMERIC(10, 2) UNSIGNED DEFAULT NULL');
        $this->addSql('ALTER TABLE `order` ADD vat_part NUMERIC(10, 7) UNSIGNED DEFAULT \'0.0000000\' NOT NULL, ADD balance NUMERIC(10, 2) UNSIGNED DEFAULT NULL');
    }
}

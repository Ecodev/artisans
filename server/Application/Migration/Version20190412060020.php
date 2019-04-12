<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190412060020 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable CHANGE purchase_price purchase_price NUMERIC(7, 2) UNSIGNED DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE transaction_line CHANGE balance balance NUMERIC(7, 2) UNSIGNED NOT NULL');
        $this->addSql('ALTER TABLE expense_claim CHANGE amount amount NUMERIC(7, 2) UNSIGNED NOT NULL');
    }
}

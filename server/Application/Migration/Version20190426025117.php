<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190426025117 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE transaction ADD transaction_date DATETIME NOT NULL, DROP transactionDate');
        $this->addSql('ALTER TABLE transaction_line ADD transaction_date DATETIME NOT NULL, DROP transactionDate');
    }
}

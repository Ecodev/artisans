<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190411142234 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE transaction ADD datatrans_ref VARCHAR(18) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE transaction_line DROP datatrans_ref');
    }
}

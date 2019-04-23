<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190423030854 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product CHANGE vat_rate vat_rate NUMERIC(10, 3) DEFAULT \'0.000\' NOT NULL,  ADD supplier VARCHAR(191) DEFAULT \'\' NOT NULL');
    }
}

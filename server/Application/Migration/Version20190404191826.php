<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190404191826 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD internal_remarks TEXT NOT NULL');
        $this->addSql('ALTER TABLE booking ADD remarks TEXT NOT NULL, ADD internal_remarks TEXT NOT NULL');
        $this->addSql('ALTER TABLE bookable CHANGE remarks internal_remarks TEXT NOT NULL');
        $this->addSql('ALTER TABLE expense_claim ADD internal_remarks TEXT NOT NULL');
    }
}

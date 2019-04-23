<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190423001639 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP swiss_sailing, DROP swiss_sailing_type, DROP swiss_windsurf_type, ADD company_shares_date DATE DEFAULT NULL, ADD url VARCHAR(2000) NOT NULL, DROP has_insurance');
    }
}

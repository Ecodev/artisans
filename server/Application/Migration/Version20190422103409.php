<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190422103409 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD door TINYINT(1) DEFAULT \'1\' NOT NULL, ADD code VARCHAR(10) DEFAULT \'\' NOT NULL, DROP door1, DROP door2, DROP door3, DROP door4, ADD company_shares SMALLINT DEFAULT 0 NOT NULL');
    }
}

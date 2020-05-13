<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20200513041404 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD should_delete TINYINT(1) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE organization ADD should_delete TINYINT(1) DEFAULT \'0\' NOT NULL');
    }
}

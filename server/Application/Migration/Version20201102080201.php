<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20201102080201 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE organization DROP INDEX UNIQ_C1EE637CA3BCFC8E');
        $this->addSql('ALTER TABLE organization CHANGE pattern pattern LONGTEXT NOT NULL');
        $this->addSql('ALTER TABLE organization ADD UNIQUE INDEX unique_pattern (pattern(768))');
    }
}

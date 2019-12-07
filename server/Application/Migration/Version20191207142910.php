<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20191207142910 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX uniq_a5e2a5d78a90aba9 ON configuration');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A5E2A5D74E645A7E ON configuration (`key`)');
    }
}

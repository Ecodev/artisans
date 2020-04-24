<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200424071016 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product CHANGE code code VARCHAR(25) DEFAULT NULL');
        $this->addSql('ALTER TABLE subscription CHANGE code code VARCHAR(25) DEFAULT NULL');
    }
}

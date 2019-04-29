<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190429025652 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE code code VARCHAR(20) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE product CHANGE code code VARCHAR(20) DEFAULT \'\' NOT NULL, CHANGE supplier_reference supplier_reference VARCHAR(20) DEFAULT \'\' NOT NULL');
    }
}

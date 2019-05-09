<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190509221535 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE code code VARCHAR(20) DEFAULT NULL');
        $this->addSql('UPDATE user SET code = NULL WHERE code = ""');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D64977153098 ON user (code)');

        $this->addSql('ALTER TABLE product CHANGE code code VARCHAR(20) DEFAULT NULL');
        $this->addSql('UPDATE product SET code = NULL WHERE code = ""');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD77153098 ON product (code)');
    }
}

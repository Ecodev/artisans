<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200218165716 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE subscription ADD illustration_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D35926566C FOREIGN KEY (illustration_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A3C664D35926566C ON subscription (illustration_id)');
        $this->addSql('ALTER TABLE product ADD illustration_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD5926566C FOREIGN KEY (illustration_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD5926566C ON product (illustration_id)');
    }
}

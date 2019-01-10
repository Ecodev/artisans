<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190109165812 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE transaction ADD bookable_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_723705D1EC4F5B2F ON transaction (bookable_id)');
        $this->addSql('ALTER TABLE user CHANGE name first_name VARCHAR(191) NOT NULL, ADD last_name VARCHAR(191) NOT NULL AFTER first_name');
    }
}

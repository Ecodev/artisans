<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200219150052 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE subscription ADD short_description TEXT NOT NULL');
        $this->addSql('ALTER TABLE product ADD short_description TEXT NOT NULL');
        $this->addSql('ALTER TABLE product CHANGE review_number review_number SMALLINT UNSIGNED DEFAULT NULL');
    }
}

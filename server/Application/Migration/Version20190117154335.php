<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190117154335 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable CHANGE initial_price initial_price DECIMAL(7, 2) DEFAULT \'0\' NOT NULL, CHANGE periodic_price periodic_price DECIMAL(7, 2) DEFAULT \'0\' NOT NULL');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190511161007 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE order_line ADD price_ponderation NUMERIC(4, 2) UNSIGNED NOT NULL');
        $this->addSql('ALTER TABLE product ADD ponderate_price TINYINT(1) DEFAULT \'0\' NOT NULL');
    }
}

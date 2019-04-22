<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190422094425 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product ADD price_per_unit NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, ADD margin NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, ADD vat_rate NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, ADD unit VARCHAR(10) DEFAULT \'\' NOT NULL, ADD supplier_reference VARCHAR(10) DEFAULT \'\' NOT NULL, ADD quantity NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, DROP initial_price, DROP periodic_price, CHANGE purchase_price supplier_price NUMERIC(10, 2) UNSIGNED DEFAULT \'0.00\' NOT NULL');
    }
}

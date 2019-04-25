<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190425095736 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD6813E404');
        $this->addSql('DROP INDEX IDX_D34A04AD6813E404 ON product');
        $this->addSql('ALTER TABLE product DROP credit_account_id, CHANGE margin margin NUMERIC(10, 2) DEFAULT \'0.20\' NOT NULL;');
        $this->addSql('ALTER TABLE order_line ADD vat_rate NUMERIC(10, 3) DEFAULT \'0.000\' NOT NULL;');
    }
}

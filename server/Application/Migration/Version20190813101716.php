<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190813101716 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product ADD purchase_status ENUM(\'ok\', \'to_order\', \'preordered\', \'ordered\') DEFAULT \'ok\' NOT NULL COMMENT \'(DC2Type:PurchaseStatus)\'');
        $this->addSql('ALTER TABLE product ADD minimum_quantity NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL');
    }
}

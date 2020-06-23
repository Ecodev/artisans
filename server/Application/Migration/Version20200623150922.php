<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20200623150922 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE `order` ADD country_id INT DEFAULT NULL, ADD first_name VARCHAR(191) DEFAULT \'\' NOT NULL, ADD last_name VARCHAR(191) DEFAULT \'\' NOT NULL, ADD street VARCHAR(255) DEFAULT \'\' NOT NULL, ADD postcode VARCHAR(20) DEFAULT \'\' NOT NULL, ADD locality VARCHAR(255) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_F5299398F92F3E70 ON `order` (country_id)');
    }
}

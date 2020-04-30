<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200430015346 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE subscription_type subscription_type ENUM(\'other\', \'paper\', \'digital\', \'both\') DEFAULT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE product CHANGE type type ENUM(\'other\', \'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE order_line CHANGE type type ENUM(\'other\', \'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
    }
}

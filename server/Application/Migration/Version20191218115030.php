<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20191218115030 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE order_line CHANGE type type ENUM(\'paper\', \'digital\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE product ADD type ENUM(\'paper\', \'digital\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE user_product CHANGE type type ENUM(\'paper\', \'digital\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('DROP TABLE user_product');
        $this->addSql('ALTER TABLE subscription CHANGE type type ENUM(\'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE user ADD subscription_last_number_id INT DEFAULT NULL, ADD subscription_begin DATETIME DEFAULT NULL, ADD subscription_type ENUM(\'paper\', \'digital\', \'both\') DEFAULT NULL COMMENT \'(DC2Type:ProductType)\', CHANGE restrict_renew_visibility web_temporary_access TINYINT(1) DEFAULT \'0\' NOT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649D6F2FD2 FOREIGN KEY (subscription_last_number_id) REFERENCES product (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_8D93D649D6F2FD2 ON user (subscription_last_number_id)');
    }
}

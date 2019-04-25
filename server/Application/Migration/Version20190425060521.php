<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190425060521 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, transaction_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, INDEX IDX_F529939861220EA6 (creator_id), INDEX IDX_F52993987E3C61F9 (owner_id), INDEX IDX_F5299398E37ECFB0 (updater_id), UNIQUE INDEX UNIQ_F52993982FC0CB0F (transaction_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE order_line (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, order_id INT NOT NULL, product_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, vat_part NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, name VARCHAR(191) NOT NULL, unit VARCHAR(10) DEFAULT \'\' NOT NULL, quantity NUMERIC(10, 2) DEFAULT \'0.00\' NOT NULL, balance NUMERIC(10, 2) UNSIGNED NOT NULL, INDEX IDX_9CE58EE161220EA6 (creator_id), INDEX IDX_9CE58EE17E3C61F9 (owner_id), INDEX IDX_9CE58EE1E37ECFB0 (updater_id), INDEX IDX_9CE58EE18D9F6D38 (order_id), INDEX IDX_9CE58EE14584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F529939861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F52993987E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F52993982FC0CB0F FOREIGN KEY (transaction_id) REFERENCES transaction (id)');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE18D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE14584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE transaction_line DROP FOREIGN KEY FK_33578A574584665A');
        $this->addSql('DROP INDEX IDX_33578A574584665A ON transaction_line');
        $this->addSql('ALTER TABLE transaction_line DROP product_id');
    }
}

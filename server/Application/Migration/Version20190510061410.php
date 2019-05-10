<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190510061410 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE stock_movement (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, order_line_id INT DEFAULT NULL, product_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, type ENUM(\'sale\', \'loss\', \'delivery\', \'inventory\') NOT NULL COMMENT \'(DC2Type:StockMovementType)\', quantity NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL, delta NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL, INDEX IDX_BB1BC1B561220EA6 (creator_id), INDEX IDX_BB1BC1B57E3C61F9 (owner_id), INDEX IDX_BB1BC1B5E37ECFB0 (updater_id), UNIQUE INDEX UNIQ_BB1BC1B5BB01DC09 (order_line_id), INDEX IDX_BB1BC1B54584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B57E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B5BB01DC09 FOREIGN KEY (order_line_id) REFERENCES order_line (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B54584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product CHANGE quantity quantity NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL');
        $this->addSql('ALTER TABLE order_line CHANGE quantity quantity NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL');
    }
}

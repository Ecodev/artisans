<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181120165452 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE booking_item DROP FOREIGN KEY FK_78A0750126F525E');
        $this->addSql('CREATE TABLE booking_resource (booking_id INT NOT NULL, resource_id INT NOT NULL, INDEX IDX_87A56A9B3301C60 (booking_id), INDEX IDX_87A56A9B89329D25 (resource_id), PRIMARY KEY(booking_id, resource_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE resource (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, description TEXT NOT NULL, INDEX IDX_BC91F41661220EA6 (creator_id), INDEX IDX_BC91F4167E3C61F9 (owner_id), INDEX IDX_BC91F416E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE booking_resource ADD CONSTRAINT FK_87A56A9B3301C60 FOREIGN KEY (booking_id) REFERENCES booking (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE booking_resource ADD CONSTRAINT FK_87A56A9B89329D25 FOREIGN KEY (resource_id) REFERENCES resource (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE resource ADD CONSTRAINT FK_BC91F41661220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE resource ADD CONSTRAINT FK_BC91F4167E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE resource ADD CONSTRAINT FK_BC91F416E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE booking_item');
        $this->addSql('DROP TABLE item');
    }
}

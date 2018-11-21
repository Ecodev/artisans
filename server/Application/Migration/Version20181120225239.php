<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181120225239 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE tag_resource (tag_id INT NOT NULL, resource_id INT NOT NULL, INDEX IDX_8AA08FCDBAD26311 (tag_id), INDEX IDX_8AA08FCD89329D25 (resource_id), PRIMARY KEY(tag_id, resource_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE tag_resource ADD CONSTRAINT FK_8AA08FCDBAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tag_resource ADD CONSTRAINT FK_8AA08FCD89329D25 FOREIGN KEY (resource_id) REFERENCES resource (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tag ADD color VARCHAR(25) DEFAULT \'\' NOT NULL');
    }
}

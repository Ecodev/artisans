<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200219094801 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product ADD file_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD93CB796C FOREIGN KEY (file_id) REFERENCES file (id) ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD93CB796C ON product (file_id)');
        $this->addSql('UPDATE product INNER JOIN file ON file.product_id = product.id SET product.file_id = file.id');
        $this->addSql('ALTER TABLE file DROP FOREIGN KEY FK_8C9F36104584665A');
        $this->addSql('DROP INDEX IDX_8C9F36104584665A ON file');
        $this->addSql('ALTER TABLE file DROP product_id');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200423065029 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product ADD review_id INT DEFAULT NULL, ADD CHECK (review_id IS NULL OR review_number IS NULL)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD3E2E969B FOREIGN KEY (review_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD1CE65894 ON product (review_number)');
        $this->addSql('CREATE INDEX IDX_D34A04AD3E2E969B ON product (review_id)');
    }
}

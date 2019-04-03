<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190403060542 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable ADD credit_account_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B81246813E404 FOREIGN KEY (credit_account_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_A10B81246813E404 ON bookable (credit_account_id)');
    }
}

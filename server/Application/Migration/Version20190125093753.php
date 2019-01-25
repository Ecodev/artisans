<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190125093753 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE expense_claim DROP FOREIGN KEY FK_461791DA76ED395');
        $this->addSql('DROP INDEX IDX_461791DA76ED395 ON expense_claim');
        $this->addSql('ALTER TABLE expense_claim DROP user_id, CHANGE owner_id owner_id INT NOT NULL');
    }
}

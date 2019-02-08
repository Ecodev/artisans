<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190208105619 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE expense_claim CHANGE status status ENUM(\'new\', \'processing\', \'processed\', \'rejected\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:ExpenseClaimStatus)\'');
        $this->addSql('ALTER TABLE accounting_document ADD mime VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE image ADD mime VARCHAR(255) NOT NULL');
    }
}

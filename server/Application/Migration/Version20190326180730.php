<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190326180730 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE expense_claim ADD type ENUM(\'expenseClaim\', \'refund\') DEFAULT \'expenseClaim\' NOT NULL COMMENT \'(DC2Type:ExpenseClaimType)\'');
    }
}

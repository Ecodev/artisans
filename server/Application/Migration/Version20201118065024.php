<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201118065024 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD93CB796C');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD93CB796C FOREIGN KEY (file_id) REFERENCES file (id) ON DELETE SET NULL');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200222111911 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE `order` ADD payment_method ENUM(\'datatrans\', \'ebanking\', \'bvr\') NOT NULL COMMENT \'(DC2Type:PaymentMethod)\', ADD internal_remarks TEXT NOT NULL');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200506061425 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user ADD membership ENUM(\'none\', \'due\', \'payed\') DEFAULT \'none\' NOT NULL COMMENT \'(DC2Type:Membership)\', DROP membership_begin, DROP membership_end');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221111144651 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE message CHANGE body body TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE news CHANGE content content TEXT DEFAULT \'\' NOT NULL');
    }
}

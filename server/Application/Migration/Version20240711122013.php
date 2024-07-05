<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20240711122013 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE comment CHANGE description description TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE configuration CHANGE description description TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE log CHANGE referer referer VARCHAR(500) DEFAULT \'\' NOT NULL, CHANGE request request VARCHAR(1000) DEFAULT \'\' NOT NULL, CHANGE ip ip VARCHAR(40) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE news CHANGE description description TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE `order` CHANGE internal_remarks internal_remarks TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE product CHANGE content content TEXT DEFAULT \'\' NOT NULL, CHANGE internal_remarks internal_remarks TEXT DEFAULT \'\' NOT NULL, CHANGE description description TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE session CHANGE description description TEXT DEFAULT \'\' NOT NULL, CHANGE internal_remarks internal_remarks TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE subscription CHANGE description description TEXT DEFAULT \'\' NOT NULL, CHANGE internal_remarks internal_remarks TEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE password password VARCHAR(255) DEFAULT \'\' NOT NULL');
    }
}

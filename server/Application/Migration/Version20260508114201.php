<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260508114201 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE country CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE event CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE facilitator_document CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE log CHANGE request request LONGTEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE news CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE order_line CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE product CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE product_tag CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE session CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE subscription CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
    }
}

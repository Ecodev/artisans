<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221010191051 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX creation_date ON comment (creation_date)');
        $this->addSql('CREATE INDEX update_date ON comment (update_date)');
        $this->addSql('CREATE INDEX creation_date ON configuration (creation_date)');
        $this->addSql('CREATE INDEX update_date ON configuration (update_date)');
        $this->addSql('CREATE INDEX creation_date ON country (creation_date)');
        $this->addSql('CREATE INDEX update_date ON country (update_date)');
        $this->addSql('CREATE INDEX creation_date ON event (creation_date)');
        $this->addSql('CREATE INDEX update_date ON event (update_date)');
        $this->addSql('CREATE INDEX creation_date ON facilitator_document (creation_date)');
        $this->addSql('CREATE INDEX update_date ON facilitator_document (update_date)');
        $this->addSql('CREATE INDEX creation_date ON file (creation_date)');
        $this->addSql('CREATE INDEX update_date ON file (update_date)');
        $this->addSql('CREATE INDEX creation_date ON image (creation_date)');
        $this->addSql('CREATE INDEX update_date ON image (update_date)');
        $this->addSql('DROP INDEX priority ON log');
        $this->addSql('CREATE INDEX update_date ON log (update_date)');
        $this->addSql('CREATE INDEX priority ON log (priority)');
        $this->addSql('DROP INDEX date_created ON log');
        $this->addSql('CREATE INDEX creation_date ON log (creation_date)');
        $this->addSql('CREATE INDEX creation_date ON message (creation_date)');
        $this->addSql('CREATE INDEX update_date ON message (update_date)');
        $this->addSql('CREATE INDEX creation_date ON news (creation_date)');
        $this->addSql('CREATE INDEX update_date ON news (update_date)');
        $this->addSql('CREATE INDEX creation_date ON `order` (creation_date)');
        $this->addSql('CREATE INDEX update_date ON `order` (update_date)');
        $this->addSql('CREATE INDEX creation_date ON order_line (creation_date)');
        $this->addSql('CREATE INDEX update_date ON order_line (update_date)');
        $this->addSql('CREATE INDEX creation_date ON organization (creation_date)');
        $this->addSql('CREATE INDEX update_date ON organization (update_date)');
        $this->addSql('CREATE INDEX creation_date ON product (creation_date)');
        $this->addSql('CREATE INDEX update_date ON product (update_date)');
        $this->addSql('CREATE INDEX creation_date ON product_tag (creation_date)');
        $this->addSql('CREATE INDEX update_date ON product_tag (update_date)');
        $this->addSql('CREATE INDEX creation_date ON session (creation_date)');
        $this->addSql('CREATE INDEX update_date ON session (update_date)');
        $this->addSql('CREATE INDEX creation_date ON subscription (creation_date)');
        $this->addSql('CREATE INDEX update_date ON subscription (update_date)');
        $this->addSql('CREATE INDEX creation_date ON user (creation_date)');
        $this->addSql('CREATE INDEX update_date ON user (update_date)');
    }
}

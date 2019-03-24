<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190324203753 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable CHANGE simultaneous_booking_maximum simultaneous_booking_maximum SMALLINT DEFAULT -1 NOT NULL');
        $this->addSql('ALTER TABLE transaction_line CHANGE is_reconcilied is_reconciled TINYINT(1) DEFAULT \'0\' NOT NULL');
    }
}

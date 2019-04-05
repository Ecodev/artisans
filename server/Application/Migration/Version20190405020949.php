<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190405020949 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE booking ADD bookable_id INT DEFAULT NULL');
        $this->addSql('UPDATE booking JOIN booking_bookable ON booking_bookable.booking_id = booking.id SET booking.bookable_id = booking_bookable.bookable_id');
        $this->addSql('ALTER TABLE booking ADD CONSTRAINT FK_E00CEDDEEC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_E00CEDDEEC4F5B2F ON booking (bookable_id)');
        $this->addSql('DROP TABLE booking_bookable');
    }
}

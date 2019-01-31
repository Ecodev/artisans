<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190131115742 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable ADD image_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bookable ADD CONSTRAINT FK_A10B81243DA5256D FOREIGN KEY (image_id) REFERENCES image (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A10B81243DA5256D ON bookable (image_id)');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045FEC4F5B2F');
        $this->addSql('DROP INDEX IDX_C53D045FEC4F5B2F ON image');
        $this->addSql('ALTER TABLE image DROP bookable_id');
    }
}

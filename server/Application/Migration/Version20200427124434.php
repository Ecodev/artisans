<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200427124434 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649D6F2FD2');
        $this->addSql('DROP INDEX IDX_8D93D649D6F2FD2 ON user');
        $this->addSql('ALTER TABLE user CHANGE subscription_last_number_id subscription_last_review_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6493E06759 FOREIGN KEY (subscription_last_review_id) REFERENCES product (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_8D93D6493E06759 ON user (subscription_last_review_id)');
    }
}

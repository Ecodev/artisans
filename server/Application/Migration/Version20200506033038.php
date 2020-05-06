<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200506033038 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_tag_user DROP FOREIGN KEY FK_83118DFFDF80782C');
        $this->addSql('DROP TABLE user_tag');
        $this->addSql('DROP TABLE user_tag_user');
    }
}

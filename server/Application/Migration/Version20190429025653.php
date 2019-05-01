<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190429025653 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('UPDATE product SET unit = \'\' WHERE unit NOT IN (\'kg\', \'gr\')');
        $this->addSql('UPDATE order_line SET unit = \'\' WHERE unit NOT IN (\'kg\', \'gr\')');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260216151302 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("update subscription set price_per_unit_chf = 3200 , price_per_unit_eur = 2300 where code = 'abo-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 4600 , price_per_unit_eur = 2900 where code = 'abo-web'");
        $this->addSql("update subscription set price_per_unit_chf = 6000 , price_per_unit_eur = 4000 where code = 'abo-web-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 3800 , price_per_unit_eur = 2600 where code = 'abo-pro-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 9200 , price_per_unit_eur = 5800 where code = 'abo-pro-web'");
        $this->addSql("update subscription set price_per_unit_chf = 10600 , price_per_unit_eur = 6900 where code = 'abo-pro-web-papier'");
    }
}

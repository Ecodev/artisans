<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250402144626 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql("update subscription set price_per_unit_chf = 4700 , price_per_unit_eur = 3400 where code = 'abo-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 6900 , price_per_unit_eur = 4300 where code = 'abo-web'");
        $this->addSql("update subscription set price_per_unit_chf = 9000 , price_per_unit_eur = 6000 where code = 'abo-web-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 5600 , price_per_unit_eur = 3900 where code = 'abo-pro-papier'");
        $this->addSql("update subscription set price_per_unit_chf = 13800 , price_per_unit_eur = 8600 where code = 'abo-pro-web'");
        $this->addSql("update subscription set price_per_unit_chf = 16000 , price_per_unit_eur = 10400 where code = 'abo-pro-web-papier'");
    }
}

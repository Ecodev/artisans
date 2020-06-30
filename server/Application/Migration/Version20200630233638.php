<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20200630233638 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE message CHANGE type type ENUM(\'register\', \'reset_password\', \'updated_user\', \'confirmed_registration\', \'user_pending_order\', \'user_validated_order\', \'admin_pending_order\', \'admin_validated_order\', \'request_membership_end\', \'newsletter_subscription\') NOT NULL COMMENT \'(DC2Type:MessageType)\'');
    }
}

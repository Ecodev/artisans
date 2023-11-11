<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20231111124448 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE message CHANGE type type ENUM(\'register\', \'reset_password\', \'updated_user\', \'confirmed_registration\', \'user_pending_order\', \'user_validated_order\', \'admin_pending_order\', \'admin_validated_order\', \'request_membership_end\', \'newsletter_subscription\') NOT NULL COMMENT \'(FelixEnum:1c99b4f0398cc3eed3810c8f93b024c7)(DC2Type:MessageType)\'');
        $this->addSql('ALTER TABLE `order` CHANGE status status ENUM(\'pending\', \'validated\', \'canceled\') DEFAULT \'pending\' NOT NULL COMMENT \'(FelixEnum:3ec3e70f324aecafc8e6f3d841cf0237)(DC2Type:OrderStatus)\', CHANGE payment_method payment_method ENUM(\'datatrans\', \'ebanking\', \'bvr\') NOT NULL COMMENT \'(FelixEnum:e0f9c95865f966d57c20089d6e88edcd)(DC2Type:PaymentMethod)\'');
        $this->addSql('ALTER TABLE order_line CHANGE type type ENUM(\'other\', \'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(FelixEnum:de18bfa85103b01d1e6b8552ddd7c0f9)(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE product CHANGE type type ENUM(\'other\', \'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(FelixEnum:de18bfa85103b01d1e6b8552ddd7c0f9)(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE subscription CHANGE type type ENUM(\'other\', \'paper\', \'digital\', \'both\') NOT NULL COMMENT \'(FelixEnum:de18bfa85103b01d1e6b8552ddd7c0f9)(DC2Type:ProductType)\'');
        $this->addSql('ALTER TABLE user CHANGE role role ENUM(\'member\', \'facilitator\', \'administrator\') DEFAULT \'member\' NOT NULL COMMENT \'(FelixEnum:77afc995337df77f1d533d21728304dc)(DC2Type:UserRole)\', CHANGE subscription_type subscription_type ENUM(\'other\', \'paper\', \'digital\', \'both\') DEFAULT NULL COMMENT \'(FelixEnum:de18bfa85103b01d1e6b8552ddd7c0f9)(DC2Type:ProductType)\', CHANGE membership membership ENUM(\'none\', \'member\') DEFAULT \'none\' NOT NULL COMMENT \'(FelixEnum:2c37111769980ee9f5a46a1523cad0d7)(DC2Type:Membership)\'');
    }
}

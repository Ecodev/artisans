<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221010154735 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Delete all triggers, because they are a huge slow-down when updating each records. They will be recreated after migration
        $triggers = $this->connection->executeQuery('SHOW TRIGGERS;')->fetchFirstColumn();
        foreach ($triggers as $trigger) {
            $this->addSql("DROP TRIGGER `$trigger`");
        }

        $this->addSql('UPDATE `image` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `file` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `news` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `product_tag` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `message` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `organization` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `log` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `comment` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `event` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `country` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `user` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `product` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `configuration` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `session` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `order_line` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `subscription` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `order` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
        $this->addSql('UPDATE `facilitator_document` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND  update_date IS NULL;');
    }
}

<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20181208061959 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bookable ADD remarks TEXT NOT NULL');
        $this->addSql('ALTER TABLE user ADD last_login DATETIME DEFAULT NULL, ADD active_from DATETIME DEFAULT NULL, ADD welcome_session_date DATETIME DEFAULT NULL, ADD sex SMALLINT DEFAULT 0 NOT NULL, ADD mobile_phone VARCHAR(25) DEFAULT \'\' NOT NULL, ADD ichtus_swiss_sailing VARCHAR(25) DEFAULT \'\' NOT NULL, ADD terms_agreement TINYINT(1) DEFAULT \'0\' NOT NULL, ADD has_insurance TINYINT(1) DEFAULT \'0\' NOT NULL, ADD receives_newsletter TINYINT(1) DEFAULT \'0\' NOT NULL, ADD family_relationship ENUM(\'householder\', \'partner\', \'ex_partner\', \'child\', \'parent\', \'sister\', \'brother\') DEFAULT \'householder\' NOT NULL COMMENT \'(DC2Type:Relationship)\', ADD billing_type ENUM(\'all_electronic\', \'paper_bill_electronic_reminder\', \'paper_bill_paper_reminder\') DEFAULT \'all_electronic\' NOT NULL COMMENT \'(DC2Type:BillingType)\', ADD remarks TEXT NOT NULL');
    }
}

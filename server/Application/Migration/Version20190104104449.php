<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190104104449 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_64C19C161220EA6 (creator_id), INDEX IDX_64C19C17E3C61F9 (owner_id), INDEX IDX_64C19C1E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category_category (category_source INT NOT NULL, category_target INT NOT NULL, INDEX IDX_B1369DBA5062B508 (category_source), INDEX IDX_B1369DBA4987E587 (category_target), PRIMARY KEY(category_source, category_target)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transaction (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, account_id INT NOT NULL, expense_claim_id INT DEFAULT NULL, category_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, amount NUMERIC(7, 2) NOT NULL, transactionDate DATE NOT NULL, internal_remarks TEXT NOT NULL, name VARCHAR(191) NOT NULL, remarks TEXT NOT NULL, INDEX IDX_723705D161220EA6 (creator_id), INDEX IDX_723705D17E3C61F9 (owner_id), INDEX IDX_723705D1E37ECFB0 (updater_id), INDEX IDX_723705D19B6B5FBA (account_id), INDEX IDX_723705D1B6F76666 (expense_claim_id), INDEX IDX_723705D112469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE account (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, user_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, balance NUMERIC(7, 2) DEFAULT \'0.00\' NOT NULL, iban VARCHAR(32) NOT NULL, name VARCHAR(191) NOT NULL, UNIQUE INDEX UNIQ_7D3656A4FAD56E62 (iban), INDEX IDX_7D3656A461220EA6 (creator_id), INDEX IDX_7D3656A47E3C61F9 (owner_id), INDEX IDX_7D3656A4E37ECFB0 (updater_id), UNIQUE INDEX UNIQ_7D3656A4A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE accounting_document (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, expense_claim_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, filename VARCHAR(190) NOT NULL, INDEX IDX_60EDA78461220EA6 (creator_id), INDEX IDX_60EDA7847E3C61F9 (owner_id), INDEX IDX_60EDA784E37ECFB0 (updater_id), INDEX IDX_60EDA784B6F76666 (expense_claim_id), UNIQUE INDEX unique_name (filename), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE expense_claim (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, user_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, amount NUMERIC(7, 2) NOT NULL, status ENUM(\'new\', \'processed\', \'rejected\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:ExpenseClaimStatus)\', name VARCHAR(191) NOT NULL, description TEXT NOT NULL, remarks TEXT NOT NULL, INDEX IDX_461791D61220EA6 (creator_id), INDEX IDX_461791D7E3C61F9 (owner_id), INDEX IDX_461791DE37ECFB0 (updater_id), INDEX IDX_461791DA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE category_category ADD CONSTRAINT FK_B1369DBA5062B508 FOREIGN KEY (category_source) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE category_category ADD CONSTRAINT FK_B1369DBA4987E587 FOREIGN KEY (category_target) REFERENCES category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D19B6B5FBA FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1B6F76666 FOREIGN KEY (expense_claim_id) REFERENCES expense_claim (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D112469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A47E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE accounting_document ADD CONSTRAINT FK_60EDA78461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE accounting_document ADD CONSTRAINT FK_60EDA7847E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE accounting_document ADD CONSTRAINT FK_60EDA784E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE accounting_document ADD CONSTRAINT FK_60EDA784B6F76666 FOREIGN KEY (expense_claim_id) REFERENCES expense_claim (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE expense_claim ADD CONSTRAINT FK_461791D61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE expense_claim ADD CONSTRAINT FK_461791D7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE expense_claim ADD CONSTRAINT FK_461791DE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE expense_claim ADD CONSTRAINT FK_461791DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user ADD account_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6499B6B5FBA FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE SET NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D6499B6B5FBA ON user (account_id)');
        $this->addSql('ALTER TABLE image CHANGE filename filename VARCHAR(190) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX unique_name ON image (filename)');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, recipient_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, type ENUM(\'monthly_reminder\', \'yearly_reminder\') NOT NULL COMMENT \'(DC2Type:MessageType)\', date_sent DATETIME DEFAULT NULL, subject VARCHAR(255) DEFAULT \'\' NOT NULL, body TEXT NOT NULL, INDEX IDX_B6BD307F61220EA6 (creator_id), INDEX IDX_B6BD307F7E3C61F9 (owner_id), INDEX IDX_B6BD307FE37ECFB0 (updater_id), INDEX IDX_B6BD307FE92F8F78 (recipient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE92F8F78 FOREIGN KEY (recipient_id) REFERENCES user (id) ON DELETE CASCADE');
    }
}

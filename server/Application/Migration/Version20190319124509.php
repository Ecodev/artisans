<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190319124509 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE category_category DROP FOREIGN KEY FK_B1369DBA4987E587');
        $this->addSql('ALTER TABLE category_category DROP FOREIGN KEY FK_B1369DBA5062B508');
        $this->addSql('ALTER TABLE transaction DROP FOREIGN KEY FK_723705D112469DE2');
        $this->addSql('CREATE TABLE transaction_line (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, transaction_id INT NOT NULL, debit_id INT DEFAULT NULL, credit_id INT DEFAULT NULL, bookable_id INT DEFAULT NULL, transaction_tag_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, balance NUMERIC(7, 2) NOT NULL, transactionDate DATE NOT NULL, datatrans_ref VARCHAR(18) DEFAULT \'\' NOT NULL, is_reconcilied TINYINT(1) DEFAULT \'0\' NOT NULL, name VARCHAR(191) NOT NULL, remarks TEXT NOT NULL, INDEX IDX_33578A5761220EA6 (creator_id), INDEX IDX_33578A577E3C61F9 (owner_id), INDEX IDX_33578A57E37ECFB0 (updater_id), INDEX IDX_33578A572FC0CB0F (transaction_id), INDEX IDX_33578A57444E82EE (debit_id), INDEX IDX_33578A57CE062FF9 (credit_id), INDEX IDX_33578A57EC4F5B2F (bookable_id), INDEX IDX_33578A57CCAF1151 (transaction_tag_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transaction_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_F8CD024A61220EA6 (creator_id), INDEX IDX_F8CD024A7E3C61F9 (owner_id), INDEX IDX_F8CD024AE37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A5761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A577E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A57E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A572FC0CB0F FOREIGN KEY (transaction_id) REFERENCES transaction (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A57444E82EE FOREIGN KEY (debit_id) REFERENCES account (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A57CE062FF9 FOREIGN KEY (credit_id) REFERENCES account (id) ON DELETE RESTRICT');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A57EC4F5B2F FOREIGN KEY (bookable_id) REFERENCES bookable (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE transaction_line ADD CONSTRAINT FK_33578A57CCAF1151 FOREIGN KEY (transaction_tag_id) REFERENCES transaction_tag (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE transaction_tag ADD CONSTRAINT FK_F8CD024A61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction_tag ADD CONSTRAINT FK_F8CD024A7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction_tag ADD CONSTRAINT FK_F8CD024AE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE category_category');
        $this->addSql('ALTER TABLE transaction DROP FOREIGN KEY FK_723705D19B6B5FBA');
        $this->addSql('ALTER TABLE transaction DROP FOREIGN KEY FK_723705D1EC4F5B2F');
        $this->addSql('DROP INDEX IDX_723705D19B6B5FBA ON transaction');
        $this->addSql('DROP INDEX IDX_723705D112469DE2 ON transaction');
        $this->addSql('DROP INDEX IDX_723705D1EC4F5B2F ON transaction');
        $this->addSql('ALTER TABLE transaction DROP account_id, DROP category_id, DROP bookable_id, DROP amount');
        $this->addSql('ALTER TABLE account ADD parent_id INT DEFAULT NULL, ADD type ENUM(\'asset\', \'liability\', \'revenue\', \'expense\', \'equity\', \'group\') NOT NULL COMMENT \'(DC2Type:AccountType)\', ADD code VARCHAR(10) NOT NULL');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4727ACA70 FOREIGN KEY (parent_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('DROP INDEX UNIQ_7D3656A4FAD56E62 ON account');
        $this->addSql('ALTER TABLE account CHANGE iban iban VARCHAR(34) DEFAULT \'\' NOT NULL');
        $this->addSql('DROP INDEX UNIQ_8D93D649FAD56E62 ON user');
        $this->addSql('ALTER TABLE user CHANGE iban iban VARCHAR(34) DEFAULT \'\' NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_7D3656A477153098 ON account (code)');
        $this->addSql('CREATE INDEX IDX_7D3656A4727ACA70 ON account (parent_id)');
        $this->addSql('ALTER TABLE accounting_document ADD transaction_id INT DEFAULT NULL, CHANGE expense_claim_id expense_claim_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE accounting_document ADD CONSTRAINT FK_60EDA7842FC0CB0F FOREIGN KEY (transaction_id) REFERENCES transaction (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_60EDA7842FC0CB0F ON accounting_document (transaction_id)');
    }
}

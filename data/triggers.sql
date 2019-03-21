/*
| Account type | Debit        | Credit       |
|:------------:|:------------:|:------------:|
| Asset        | Increase (+) | Decrease (-) |
| Liability    | Decrease (-) | Increase (+) |
| Equity       | Decrease (-) | Increase (+) |
| Expense      | Increase (+) | Decrease (-) |
| Revenue      | Decrease (-) | Increase (+) |
| Group        | N/A          | N/A          |
 */

DROP TRIGGER IF EXISTS transaction_line_INSERT;

DELIMITER //

CREATE TRIGGER transaction_line_INSERT
  AFTER INSERT
  ON transaction_line
  FOR EACH ROW
  BEGIN
    IF NEW.debit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('liability', 'equity', 'revenue'), account.balance-NEW.balance, IF(account.type IN ('asset', 'expense'), account.balance+NEW.balance, account.balance)) WHERE account.id=NEW.debit_id;
    END IF;

    IF NEW.credit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('asset', 'expense'), account.balance-NEW.balance, IF(account.type IN ('liability', 'equity', 'revenue'), account.balance+NEW.balance, account.balance)) WHERE account.id=NEW.credit_id;
    END IF;
  END; //

DELIMITER ;

DROP TRIGGER IF EXISTS transaction_line_DELETE;

DELIMITER //

CREATE TRIGGER transaction_line_DELETE
  AFTER DELETE
  ON transaction_line
  FOR EACH ROW
  BEGIN
    IF OLD.debit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('liability', 'equity', 'revenue'), account.balance+OLD.balance, IF(account.type IN ('asset', 'expense'), account.balance-OLD.balance, account.balance)) WHERE account.id=OLD.debit_id;
    END IF;

    IF OLD.credit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('asset', 'expense'), account.balance+OLD.balance, IF(account.type IN ('liability', 'equity', 'revenue'), account.balance-OLD.balance, account.balance)) WHERE account.id=OLD.credit_id;
    END IF;
  END; //

DELIMITER ;

DROP TRIGGER IF EXISTS transaction_line_UPDATE;

DELIMITER //

CREATE TRIGGER transaction_line_UPDATE
  AFTER UPDATE
  ON transaction_line
  FOR EACH ROW
  BEGIN
    IF OLD.debit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('liability', 'equity', 'revenue'), account.balance+OLD.balance, IF(account.type IN ('asset', 'expense'), account.balance-OLD.balance, account.balance)) WHERE account.id=OLD.debit_id;
    END IF;

    IF NEW.debit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('liability', 'equity', 'revenue'), account.balance-NEW.balance, IF(account.type IN ('asset', 'expense'), account.balance+NEW.balance, account.balance)) WHERE account.id=NEW.debit_id;
    END IF;

    IF OLD.credit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('asset', 'expense'), account.balance+OLD.balance, IF(account.type IN ('liability', 'equity', 'revenue'), account.balance-OLD.balance, account.balance)) WHERE account.id=OLD.credit_id;
    END IF;

    IF NEW.credit_id IS NOT NULL THEN
      UPDATE account SET account.balance=IF(account.type IN ('asset', 'expense'), account.balance-NEW.balance, IF(account.type IN ('liability', 'equity', 'revenue'), account.balance+NEW.balance, account.balance)) WHERE account.id=NEW.credit_id;
    END IF;

  END; //

DELIMITER ;
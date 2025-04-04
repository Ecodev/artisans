DELIMITER ~~

CREATE OR REPLACE PROCEDURE update_order_balance (IN orderId INT)
BEGIN

    UPDATE `order`
    SET balance_chf = (SELECT SUM(balance_chf) FROM order_line WHERE order_id = orderId),
        balance_eur = (SELECT SUM(balance_eur) FROM order_line WHERE order_id = orderId)
    WHERE id = orderId;

END ~~


CREATE OR REPLACE TRIGGER order_line_after_insert
  AFTER INSERT
  ON order_line
  FOR EACH ROW
  BEGIN
      CALL update_order_balance(NEW.order_id);
  END; ~~


CREATE OR REPLACE TRIGGER order_line_after_update
  AFTER UPDATE
  ON order_line
  FOR EACH ROW
  BEGIN
      CALL update_order_balance(OLD.order_id);
      CALL update_order_balance(NEW.order_id);
  END; ~~


CREATE OR REPLACE TRIGGER order_line_after_delete
  AFTER DELETE
  ON order_line
  FOR EACH ROW
  BEGIN
      CALL update_order_balance(OLD.order_id);
  END; ~~

DELIMITER ;

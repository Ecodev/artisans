<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Api\Exception;
use Application\Api\Helper;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\User;

class OrderRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if (!$user) {
            return '-1';
        }

        if (in_array($user->getRole(), [User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return 'SELECT DISTINCT order.id FROM order
              JOIN order_line ON order.id = order_line.order_id
              JOIN account ON order_line.debit_id = account.id OR order_line.credit_id = account.id 
              WHERE account.owner_id = ' . $user->getId();
    }

    /**
     * @param Order $order
     * @param array $lines
     */
    public function hydrateLinesAndFlush(Order $order, array $lines): void
    {
        if (!$lines) {
            throw new Exception('A Order must have at least one OrderLine');
        }

        // Destroy all previously existing OrderLine
        foreach ($order->getOrderLines() as $line) {
            $this->getEntityManager()->remove($line);
        }
        $order->getOrderLines()->clear();

        $accounts = [];
        foreach ($lines as $line) {
            $orderLine = new OrderLine();
            Helper::hydrate($orderLine, $line);
            if (!$orderLine->getCredit() && !$orderLine->getDebit()) {
                throw new Exception('Cannot create a OrderLine without any account');
            }
            $accounts[] = $orderLine->getCredit();
            $accounts[] = $orderLine->getDebit();

            $orderLine->setOrder($order);
            $orderLine->setOrderDate($order->getOrderDate());
            $this->getEntityManager()->persist($orderLine);
        }

        $this->getEntityManager()->persist($order);
        $this->getEntityManager()->flush();

        // Be sure to refresh the new account balance that were computed by DB triggers
        $accounts = array_filter(array_unique($accounts, SORT_REGULAR));
        foreach ($accounts as $account) {
            $this->getEntityManager()->refresh($account);
        }
    }
}

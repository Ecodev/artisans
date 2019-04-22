<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\Account;
use Application\Model\Bookable;
use Application\Model\TransactionLine;
use Application\Model\User;
use Application\Service\Invoicer;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class InvoicerTest extends TestCase
{
    use TestWithTransaction;

    /**
     * @dataProvider providerInvoiceInitial
     *
     * @param string $initialPrice
     * @param string $periodicPrice
     * @param array $expected
     */
    public function testInvoiceInitial(string $initialPrice, string $periodicPrice, array $expected): void
    {
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');

        $this->getEntityManager()->getRepository(Account::class)->getOrCreate($user);

        $bookable = new Bookable();
        $bookable->setName('My bookable');
        $bookable->setInitialPrice($initialPrice);
        $bookable->setPeriodicPrice($periodicPrice);

        $bookableAccount = new Account();
        $bookableAccount->setName('Bookable account');
        $bookable->setCreditAccount($bookableAccount);

        global $container;
        $invoicer = $container->get(Invoicer::class);
        $invoicer->invoiceInitial($user, $bookable);

        $account = $user->getAccount();

        $all = array_merge(
            $account->getCreditTransactionLines()->toArray(),
            $account->getDebitTransactionLines()->toArray()
        );
        $actual = [];

        /** @var TransactionLine $t */
        $transaction = null;
        foreach ($all as $t) {
            if (!$transaction) {
                $transaction = $t->getTransaction();
                self::assertNotNull($transaction, 'must belong to a transaction');
            } else {
                self::assertSame($transaction, $t->getTransaction(), 'all lines should belong to same transaction');
            }

            $actual[] = [
                $t->getName(),
                $t->getBookable()->getName(),
                $t->getDebit()->getName(),
                $t->getCredit()->getName(),
                $t->getBalance(),
            ];
        }

        self::assertSame($expected, $actual);
    }

    public function providerInvoiceInitial(): array
    {
        return [
            'free bookable should create nothing' => [
                '0',
                '0',
                [],
            ],
            'only initial' => [
                '10.25',
                '0',
                [
                    [
                        'My bookable',
                        'My bookable',
                        'John Doe',
                        'Bookable account',
                        '10.25',
                    ],
                ],
            ],
            'only periodic' => [
                '0',
                '90.25',
                [
                ],
            ],
            'both initial and periodic should create two lines' => [
                '10.25',
                '90.25',
                [
                    [
                        'My bookable',
                        'My bookable',
                        'John Doe',
                        'Bookable account',
                        '10.25',
                    ],
                ],
            ],
            'negative balance should swap accounts' => [
                '-10.25',
                '-90.25',
                [
                    [
                        'My bookable',
                        'My bookable',
                        'Bookable account',
                        'John Doe',
                        '10.25',
                    ],
                ],
            ],
        ];
    }
}

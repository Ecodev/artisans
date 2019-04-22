<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\Account;
use Application\Model\Product;
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
     * @param string $pricePerUnit
     * @param array $expected
     */
    public function testInvoiceInitial(string $pricePerUnit, array $expected): void
    {
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');

        $this->getEntityManager()->getRepository(Account::class)->getOrCreate($user);

        $product = new Product();
        $product->setName('My product');
        $product->setPricePerUnit($pricePerUnit);

        $productAccount = new Account();
        $productAccount->setName('Product account');
        $product->setCreditAccount($productAccount);

        global $container;
        $invoicer = $container->get(Invoicer::class);
        $invoicer->createTransaction($user, [$product]);

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
                $t->getProduct()->getName(),
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
            'free product should create nothing' => [
                '0',
                [],
            ],
            'only initial' => [
                '10.25',
                [
                    [
                        'My product',
                        'My product',
                        'John Doe',
                        'Product account',
                        '10.25',
                    ],
                ],
            ],
            'negative balance should swap accounts' => [
                '-10.25',
                [
                    [
                        'My product',
                        'My product',
                        'Product account',
                        'John Doe',
                        '10.25',
                    ],
                ],
            ],
        ];
    }
}

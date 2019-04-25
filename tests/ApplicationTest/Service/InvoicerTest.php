<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\Account;
use Application\Model\Product;
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
     * @param array $input
     * @param array $expectedOrderLines
     * @param array $expectedTransactionLines
     */
    public function testInvoiceInitial(array $input, array $expectedOrderLines, array $expectedTransactionLines): void
    {
        $user = new User();
        $user->setFirstName('John');
        $user->setLastName('Doe');

        $input = $this->hydrateTestData($input);

        global $container;
        /** @var Invoicer $invoicer */
        $invoicer = $container->get(Invoicer::class);
        $order = $invoicer->createOrder($user, $input);

        $actualOrderLines = [];
        foreach ($order->getOrderLines() as $orderLine) {
            self::assertSame($orderLine->getName(), $orderLine->getProduct()->getName());
            $actualOrderLines[] = [
                $orderLine->getName(),
                $orderLine->getUnit(),
                $orderLine->getQuantity(),
                $orderLine->getBalance(),
                $orderLine->getVatPart(),
            ];
        }
        self::assertSame($expectedOrderLines, $actualOrderLines);

        $actualTransactionLines = [];
        foreach ($order->getTransaction()->getTransactionLines() as $transactionLine) {
            $actualTransactionLines[] = [
                $transactionLine->getName(),
                $transactionLine->getDebit()->getName(),
                $transactionLine->getCredit()->getName(),
                $transactionLine->getBalance(),
            ];
        }
        self::assertSame($expectedTransactionLines, $actualTransactionLines);
    }

    public function providerInvoiceInitial(): array
    {
        return [
            'free product should create order, but empty transactions' => [
                [
                    [
                        'quantity' => '1',
                        'product' => [
                            'name' => 'My product',
                            'pricePerUnit' => '0',
                            'unit' => 'kg',
                            'creditAccount' => 10015,
                        ],

                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '0',
                        '0.00',
                    ],
                ],
                [],
            ],
            'only initial' => [
                [
                    [
                        'quantity' => '4',
                        'product' => [
                            'name' => 'My product 1',
                            'pricePerUnit' => '2.50',
                            'unit' => 'kg',
                            'creditAccount' => 10015,
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'product' => [
                            'name' => 'My product 2',
                            'pricePerUnit' => '200',
                            'unit' => '',
                            'creditAccount' => 10016,
                        ],
                    ],

                ],
                [
                    [
                        'My product 1',
                        'kg',
                        '4',
                        '10.00',
                        '0.77',

                    ],
                    [
                        'My product 2',
                        '',
                        '1',
                        '200',
                        '5.00',
                    ],
                ],
                [
                    [
                        'My product 1',
                        'John Doe',
                        'Ventes brutes TVA taux normal (7.7%)',
                        '10.00',
                    ],
                    [
                        'My product 2',
                        'John Doe',
                        'Ventes brutes TVA taux réduit (2.5%)',
                        '200',
                    ],
                ],
            ],
            'negative balance should swap accounts' => [
                [
                    [
                        'quantity' => '1',
                        'product' => [
                            'name' => 'My product',
                            'pricePerUnit' => '-100',
                            'unit' => 'kg',
                            'creditAccount' => 10015,
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '-100',
                        '-7.70',
                    ],
                ],
                [
                    [
                        'My product',
                        'Ventes brutes TVA taux normal (7.7%)',
                        'John Doe',
                        '100',
                    ],
                ],
            ],
        ];
    }

    private function hydrateTestData(array $input): array
    {
        foreach ($input as &$i) {
            $p = $i['product'];

            $product = new Product();
            $product->setName($p['name']);
            $product->setPricePerUnit($p['pricePerUnit']);
            $product->setUnit($p['unit']);

            if ($p['creditAccount']) {
                $account = $this->getEntityManager()->getReference(Account::class, $p['creditAccount']);
                $product->setCreditAccount($account);
            }

            $i['product'] = $product;
        }

        return $input;
    }
}

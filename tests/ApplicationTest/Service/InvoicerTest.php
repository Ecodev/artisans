<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

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
                $orderLine->getVatRate(),
                $orderLine->getPricePonderation(),
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
                        'pricePonderation' => '1.00',
                        'product' => [
                            'name' => 'My product',
                            'pricePerUnit' => '0',
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                        ],

                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '0.00',
                        '0.077',
                        '1.00',
                    ],
                ],
                [],
            ],
            'normal' => [
                [
                    [
                        'quantity' => '3.100',
                        'pricePonderation' => '1.00',
                        'product' => [
                            'name' => 'My product 1',
                            'pricePerUnit' => '2.75',
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'pricePonderation' => '1.00',
                        'product' => [
                            'name' => 'My product 2',
                            'pricePerUnit' => '200',
                            'unit' => '',
                            'vatRate' => '0.025',
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        'kg',
                        '3.100',
                        '8.53',
                        '0.077',
                        '1.00',

                    ],
                    [
                        'My product 2',
                        '',
                        '1',
                        '200.00',
                        '0.025',
                        '1.00',
                    ],
                ],
                [
                    [
                        'Achats',
                        'John Doe',
                        'Vente de marchandises',
                        '208.53',
                    ],
                ],
            ],
            'with ponderated prices' => [
                [
                    [
                        'quantity' => '3.100',
                        'pricePonderation' => '0.30',
                        'product' => [
                            'name' => 'My product 1',
                            'pricePerUnit' => '2.75',
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'pricePonderation' => '0.50',
                        'product' => [
                            'name' => 'My product 2',
                            'pricePerUnit' => '200',
                            'unit' => '',
                            'vatRate' => '0.025',
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        'kg',
                        '3.100',
                        '2.56',
                        '0.077',
                        '0.30',
                    ],
                    [
                        'My product 2',
                        '',
                        '1',
                        '100.00',
                        '0.025',
                        '0.50',
                    ],
                ],
                [
                    [
                        'Achats',
                        'John Doe',
                        'Vente de marchandises',
                        '102.56',
                    ],
                ],
            ],
            'negative balance should swap accounts' => [
                [
                    [
                        'quantity' => '1',
                        'pricePonderation' => '1.00',
                        'product' => [
                            'name' => 'My product',
                            'pricePerUnit' => '-100',
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '-100.00',
                        '0.077',
                        '1.00',
                    ],
                ],
                [
                    [
                        'Achats',
                        'Vente de marchandises',
                        'John Doe',
                        '100.00',
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
            $product->setVatRate($p['vatRate']);

            $i['product'] = $product;
        }

        return $input;
    }
}

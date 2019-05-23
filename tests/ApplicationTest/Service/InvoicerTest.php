<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\User;
use Application\Service\Invoicer;
use ApplicationTest\Traits\TestWithTransaction;
use Money\Money;
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
        /** @var OrderLine $orderLine */
        foreach ($order->getOrderLines() as $orderLine) {
            self::assertSame($orderLine->getName(), $orderLine->getProduct()->getName());
            $actualOrderLines[] = [
                $orderLine->getName(),
                $orderLine->getUnit(),
                $orderLine->getQuantity(),
                $orderLine->getBalance()->getAmount(),
                $orderLine->getVatRate(),
                $orderLine->getPricePonderation(),
                $orderLine->getProduct()->getQuantity(),
            ];
        }
        self::assertSame($expectedOrderLines, $actualOrderLines);

        $actualTransactionLines = [];
        foreach ($order->getTransaction()->getTransactionLines() as $transactionLine) {
            $actualTransactionLines[] = [
                $transactionLine->getName(),
                $transactionLine->getDebit()->getName(),
                $transactionLine->getCredit()->getName(),
                $transactionLine->getBalance()->getAmount(),
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
                            'pricePerUnit' => Money::CHF(0),
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                            'quantity' => '10',
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '0',
                        '0.077',
                        '1.00',
                        '9.000',
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
                            'pricePerUnit' => Money::CHF(275),
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                            'quantity' => '10',
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'pricePonderation' => '1.00',
                        'product' => [
                            'name' => 'My product 2',
                            'pricePerUnit' => Money::CHF(20000),
                            'unit' => '',
                            'vatRate' => '0.025',
                            'quantity' => '10',
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        'kg',
                        '3.100',
                        '853',
                        '0.077',
                        '1.00',
                        '6.900',
                    ],
                    [
                        'My product 2',
                        '',
                        '1',
                        '20000',
                        '0.025',
                        '1.00',
                        '9.000',
                    ],
                ],
                [
                    [
                        'Achats',
                        'John Doe',
                        'Vente de marchandises',
                        '20853',
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
                            'pricePerUnit' => Money::CHF(275),
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                            'quantity' => '10',
                        ],
                    ],
                    [
                        'quantity' => '1',
                        'pricePonderation' => '0.50',
                        'product' => [
                            'name' => 'My product 2',
                            'pricePerUnit' => Money::CHF(20000),
                            'unit' => '',
                            'vatRate' => '0.025',
                            'quantity' => '10',
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        'kg',
                        '3.100',
                        '256',
                        '0.077',
                        '0.30',
                        '6.900',
                    ],
                    [
                        'My product 2',
                        '',
                        '1',
                        '10000',
                        '0.025',
                        '0.50',
                        '9.000',
                    ],
                ],
                [
                    [
                        'Achats',
                        'John Doe',
                        'Vente de marchandises',
                        '10256',
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
                            'pricePerUnit' => Money::CHF(-10000),
                            'unit' => 'kg',
                            'vatRate' => '0.077',
                            'quantity' => '10',
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        'kg',
                        '1',
                        '-10000',
                        '0.077',
                        '1.00',
                        '9.000',
                    ],
                ],
                [
                    [
                        'Achats',
                        'Vente de marchandises',
                        'John Doe',
                        '10000',
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
            $product->setQuantity($p['quantity']);

            $i['product'] = $product;
        }

        return $input;
    }
}

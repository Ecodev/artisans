<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\DBAL\Types\PaymentMethodType;
use Application\DBAL\Types\ProductTypeType;
use Application\Model\AbstractProduct;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Product;
use Application\Model\Subscription;
use Application\Service\Invoicer;
use ApplicationTest\Traits\TestWithTransactionAndUser;
use Money\Money;
use PHPUnit\Framework\TestCase;

class InvoicerTest extends TestCase
{
    use TestWithTransactionAndUser;

    /**
     * @dataProvider providerCreateOrder
     */
    public function testCreateOrder(array $input, array $expectedOrderLines): void
    {
        $input['orderLines'] = $this->hydrateTestData($input['orderLines']);

        global $container;
        /** @var Invoicer $invoicer */
        $invoicer = $container->get(Invoicer::class);
        $order = $invoicer->createOrder($input);

        $actualOrderLines = $this->extractOrderLines($order);
        self::assertSame($expectedOrderLines, $actualOrderLines);
    }

    /**
     * @dataProvider providerUpdateOrderLineAndTransactionLine
     */
    public function testUpdateOrderLineAndTransactionLine(string $originalOrder, ?array $newProduct, array $expectedOrderLines): void
    {
        $input = $this->providerCreateOrder()[$originalOrder][0];
        $input['orderLines'] = $this->hydrateTestData($input['orderLines']);

        global $container;
        /** @var Invoicer $invoicer */
        $invoicer = $container->get(Invoicer::class);
        $order = $invoicer->createOrder($input);

        if ($newProduct) {
            $product = $this->hydrateProduct($newProduct);
        } else {
            $product = $input['orderLines'][0]['product'];
        }

        $line = [
            'quantity' => 100,
            'isCHF' => true,
            'type' => ProductTypeType::DIGITAL,
            'product' => $product,
            'additionalEmails' => [],
        ];

        $invoicer->updateOrderLineAndTransactionLine($order->getOrderLines()->first(), $line);

        $actualOrderLines = $this->extractOrderLines($order);
        self::assertSame($expectedOrderLines, $actualOrderLines);
    }

    public function providerUpdateOrderLineAndTransactionLine(): iterable
    {
        yield 'more quantity of same product' => [
            'normal',
            null,
            [
                [
                    'My product 1',
                    100,
                    '27500',
                    '0',
                    true,
                    ProductTypeType::DIGITAL,
                ],
                [
                    'My product 2',
                    1,
                    '20000',
                    '0',
                    true,
                    ProductTypeType::DIGITAL,
                ],
            ],
        ];
        yield 'more quantity of different, negative product' => [
            'normal',
            [
                'name' => 'My negative product',
                'pricePerUnitCHF' => Money::CHF(-10000),
                'pricePerUnitEUR' => Money::EUR(-15000),
            ],
            [
                [
                    'My negative product',
                    100,
                    '-1000000',
                    '0',
                    true,
                    ProductTypeType::DIGITAL,
                ],
                [
                    'My product 2',
                    1,
                    '20000',
                    '0',
                    true,
                    ProductTypeType::DIGITAL,
                ],
            ],
        ];
        yield 'from negative goes back to positive' => [
            'negative balance should swap accounts',
            [
                'name' => 'My positive product',
                'pricePerUnitCHF' => Money::CHF(10000),
                'pricePerUnitEUR' => Money::EUR(15000),
            ],
            [
                [
                    'My positive product',
                    100,
                    '1000000',
                    '0',
                    true,
                    ProductTypeType::DIGITAL,
                ],
            ],
        ];
    }

    public function providerCreateOrder(): array
    {
        return [
            'free product should create order, even with transactions for zero dollars' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'product' => [
                                'name' => 'My product',
                                'pricePerUnitCHF' => Money::CHF(0),
                                'pricePerUnitEUR' => Money::EUR(0),
                            ],
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        1,
                        '0',
                        '0',
                        true,
                        ProductTypeType::DIGITAL,
                    ],
                ],
            ],
            'normal' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 3,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'product' => [
                                'name' => 'My product 1',
                                'pricePerUnitCHF' => Money::CHF(275),
                                'pricePerUnitEUR' => Money::EUR(280),
                            ],
                            'additionalEmails' => [],
                        ],
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'product' => [
                                'name' => 'My product 2',
                                'pricePerUnitCHF' => Money::CHF(20000),
                                'pricePerUnitEUR' => Money::EUR(25000),
                            ],
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        3,
                        '825',
                        '0',
                        true,
                        ProductTypeType::DIGITAL,
                    ],
                    [
                        'My product 2',
                        1,
                        '20000',
                        '0',
                        true,
                        ProductTypeType::DIGITAL,
                    ],
                ],
            ],
            'with mixed CHF/EURO prices' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 3,
                            'isCHF' => false,
                            'type' => ProductTypeType::DIGITAL,
                            'product' => [
                                'name' => 'My product 1',
                                'pricePerUnitCHF' => Money::CHF(275),
                                'pricePerUnitEUR' => Money::EUR(280),
                            ],
                            'additionalEmails' => [],
                        ],
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::PAPER,
                            'product' => [
                                'name' => 'My product 2',
                                'pricePerUnitCHF' => Money::CHF(20000),
                                'pricePerUnitEUR' => Money::EUR(25000),
                            ],
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'My product 1',
                        3,
                        '0',
                        '840',
                        false,
                        ProductTypeType::DIGITAL,
                    ],
                    [
                        'My product 2',
                        1,
                        '20000',
                        '0',
                        true,
                        ProductTypeType::PAPER,
                    ],
                ],
            ],
            'negative balance should swap accounts' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'product' => [
                                'name' => 'My product',
                                'pricePerUnitCHF' => Money::CHF(-10000),
                                'pricePerUnitEUR' => Money::EUR(-15000),
                            ],
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'My product',
                        1,
                        '-10000',
                        '0',
                        true,
                        ProductTypeType::DIGITAL,
                    ],
                ],
            ],
            'can create order for subscription' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'subscription' => [
                                'name' => 'My subscription',
                                'pricePerUnitCHF' => Money::CHF(10000),
                                'pricePerUnitEUR' => Money::EUR(15000),
                                'type' => ProductTypeType::BOTH,
                            ],
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'My subscription',
                        1,
                        '10000',
                        '0',
                        true,
                        ProductTypeType::BOTH,
                    ],
                ],
            ],
            'can create order for donation' => [
                [
                    'paymentMethod' => PaymentMethodType::BVR,
                    'orderLines' => [
                        [
                            'quantity' => 1,
                            'isCHF' => true,
                            'type' => ProductTypeType::DIGITAL,
                            'pricePerUnit' => Money::CHF(10000),
                            'additionalEmails' => [],
                        ],
                    ],
                ],
                [
                    [
                        'Don',
                        1,
                        '10000',
                        '0',
                        true,
                        ProductTypeType::DIGITAL,
                    ],
                ],
            ],
        ];
    }

    private function hydrateTestData(array $input): array
    {
        foreach ($input as &$i) {
            if (array_key_exists('product', $i)) {
                $i['product'] = $this->hydrateProduct($i['product']);
            }
            if (array_key_exists('subscription', $i)) {
                $i['subscription'] = $this->hydrateSubscription($i['subscription']);
            }
        }

        return $input;
    }

    private function extractOrderLines(Order $order): array
    {
        $actualOrderLines = [];
        /** @var OrderLine $orderLine */
        foreach ($order->getOrderLines() as $orderLine) {
            $abstractProduct = $orderLine->getProduct() ?: $orderLine->getSubscription();
            $expectedName = $abstractProduct ? $abstractProduct->getName() : 'Don';
            self::assertSame($expectedName, $orderLine->getName());

            $actualOrderLines[] = [
                $orderLine->getName(),
                $orderLine->getQuantity(),
                $orderLine->getBalanceCHF()->getAmount(),
                $orderLine->getBalanceEUR()->getAmount(),
                $orderLine->isCHF(),
                $orderLine->getType(),
            ];
        }

        return $actualOrderLines;
    }

    private function hydrateProduct(array $p): Product
    {
        $product = new Product();
        $this->hydrateAbstractProduct($product, $p);

        return $product;
    }

    private function hydrateSubscription(array $s): Subscription
    {
        $subscription = new Subscription();
        $this->hydrateAbstractProduct($subscription, $s);

        return $subscription;
    }

    private function hydrateAbstractProduct(AbstractProduct $product, array $p): void
    {
        $product->setName($p['name']);
        $product->setPricePerUnitCHF($p['pricePerUnitCHF']);
        $product->setPricePerUnitEUR($p['pricePerUnitEUR']);
        $product->setType($p['type'] ?? ProductTypeType::DIGITAL);
    }
}

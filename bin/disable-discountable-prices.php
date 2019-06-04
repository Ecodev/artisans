#! /usr/bin/env php
<?php

/**
 * Disable discountable prices on all products
 */
use Application\Model\Product;

require_once 'server/cli.php';

$productRepository = _em()->getRepository(Product::class);

$productRepository->disableAllDiscountablePrices();

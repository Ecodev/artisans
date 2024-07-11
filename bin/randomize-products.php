#! /usr/bin/env php
<?php

declare(strict_types=1);

use Application\Model\Product;
use Application\Repository\ProductRepository;

require_once 'server/cli.php';

/** @var ProductRepository $repository */
$repository = _em()->getRepository(Product::class);
$repository->randomizeSorting();

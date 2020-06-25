#! /usr/bin/env php
<?php

use Application\Model\Product;

require_once 'server/cli.php';

_em()->getRepository(Product::class)->randomizeSorting();

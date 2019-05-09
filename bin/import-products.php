#! /usr/bin/env php
<?php

use Cake\Chronos\Chronos;

$container = require_once 'server/cli.php';

class Importer
{
    /**
     * @var \Doctrine\DBAL\Connection
     */
    private $connection;

    public function import(string $file): void
    {
        $file = realpath($file);
        echo 'importing : ' . $file . PHP_EOL;
        $this->connection = _em()->getConnection();
        $this->connection->beginTransaction();

        $handle = fopen($file, 'r');
        $skipped = [];
        $count = 0;
        while ($row = fgetcsv($handle)) {
            if (trim($row[$this->letterToColumn('C')]) !== '1') {
                continue;
            }

            $product = [
                'creation_date' => Chronos::now()->toIso8601String(),
                'code' => trim($row[$this->letterToColumn('W')]),
                'name' => ucfirst(trim($row[$this->letterToColumn('D')])),
                'description' => trim($row[$this->letterToColumn('E')]),
                'supplier' => trim($row[$this->letterToColumn('F')]),
                'price_per_unit' => $this->price($row[$this->letterToColumn('G')]),
                'unit' => $this->unit($row[$this->letterToColumn('L')]),
                'supplier_price' => $this->price($row[$this->letterToColumn('M')]),
                'vat_rate' => $this->vat($row[$this->letterToColumn('I')]),
                'margin' => $this->percent($row[$this->letterToColumn('P')], 0.20),
                'supplier_reference' => trim($row[$this->letterToColumn('V')]),
            ];

            $this->connection->insert('product', $product);
            $productId = $this->connection->lastInsertId();

            $productTagId = $this->nullable($row[$this->letterToColumn('J')]);
            if ($productTagId) {
                $this->connection->insert('product_tag_product', [
                    'product_tag_id' => $productTagId,
                    'product_id' => $productId,
                ]);
            }

            ++$count;
        }

        $this->connection->commit();

        echo count($skipped) . ' products SKIPPED because no price on rows: ' . PHP_EOL . implode(', ', $skipped) . PHP_EOL;
        echo $count . ' products imported' . PHP_EOL;
    }

    private function nullable(string $value): ?int
    {
        return $value ? (int) $value : null;
    }

    private function number(string $value): string
    {
        return str_replace(',', '.', trim($value));
    }

    private function percent(string $value, float $default): float
    {
        $q = $this->number($value);

        return $q ? $q / 100 : $default;
    }

    private function price(string $price): string
    {
        return $this->number(str_replace('CHF', '', $price));
    }

    private function letterToColumn(string $letter): int
    {
        $result = ord(mb_strtoupper($letter)) - ord('A');

        return $result;
    }

    private function unit(string $value): string
    {
        $value = trim($value);

        if (in_array($value, ['pièces', 'pièce', 'P', 'p'], true)) {
            return '';
        }

        return $value;
    }

    private function vat(string $value): float
    {
        if ($value === '0') {
            return 0.025;
        }
        if ($value === '1') {
            return 0.077;
        }

        throw new Exception('Unsupported VAT rate: ' . $value);
    }
}

$importer = new Importer();
$importer->import($argv[1]);

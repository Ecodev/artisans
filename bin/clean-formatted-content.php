#! /usr/bin/env php
<?php

declare(strict_types=1);

/**
 * A script to clean product formatted content in DB.
 */
use Application\Model\Product;
use Application\Utility;

require_once 'server/cli.php';

function cleanRichText(string $description): string
{
    $description = Utility::sanitizeRichText($description);
    $replacements = [
        ' target="_blank"' => '',
        '<p class="surligner">Vous êtes sur la version papier</p>' => '',
        '<p class="surligner">Vous êtes sur la version papier </p>' => '',
        '<p class="surligner">Vous êtes à la version papier</p>' => '',
        '<p>Vous êtes sur la version papier </p>' => '',
        '<p class="surligner">Vous êtes sur la version numérique</p>' => '',
        '<p>Aller à la version numérique</p>' => '',
        '<p>Aller à la version papier</p>' => '',
        '</p>060-n60-des-monnaies-pour-une-prosperite-sans-croissance-version-numerique.html" target="_blank">Aller à la version numérique</a></p>' => '</p>',
    ];
    $description = str_replace(array_keys($replacements), array_values($replacements), $description);

    $pregReplacements = [
        '~<p><a href="[^"]*">Aller à la version numérique</a></p>~' => '',
        '~<p class="petit"><a href="[^"]*">Aller à la version numérique</a></p>~' => '',
        '~<a href="[^"]*" target="_blank">Aller à la version numérique</a></p>~' => '',
        '~ style="[^"]*"~' => '',
        '~ class="[^"]*"~' => '',
        '~href="https://www\.larevuedurable\.com/fr/[^/]+/(\d+)-[^/]+\.html"~' => 'href="/larevuedurable/article/$1"',
    ];
    $description = preg_replace(array_keys($pregReplacements), array_values($pregReplacements), $description);

    return $description;
}

function cleanOneTable(string $table, array $fields): void
{
    $connection = _em()->getConnection();
    $qb = $connection->createQueryBuilder()
        ->from($table)
        ->addSelect('id')
        ->orderBy('id');

    foreach ($fields as $name => $f) {
        $qb->addSelect($name);
    }

    $products = $qb->fetchAllAssociative();

    $count = 0;
    $total = count($products);
    foreach ($products as $i => $row) {
        if ($i === 0 || $i % 200 === 0) {
            echo $i . '/' . $total . PHP_EOL;
        }

        // Apply cleaning
        $newRow = $row;
        foreach ($fields as $name => $f) {
            $newRow[$name] = $f($newRow[$name]);
        }

        if ($newRow !== $row) {
            unset($newRow['id']);
            $count += $connection->update($table, $newRow, ['id' => $row['id']]);
        }
    }

    echo '
Updated records in table ' . $table . ': ' . $count . '
';
}

function cleanFormattedContent(): void
{
    cleanOneTable('product', [
        'description' => fn ($v) => cleanRichText($v),
        'content' => fn ($v) => strip_tags($v),
    ]);

    cleanOneTable('news', [
        'description' => fn ($v) => strip_tags($v),
        'content' => fn ($v) => cleanRichText($v),
    ]);
}

cleanFormattedContent();

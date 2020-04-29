#! /usr/bin/env php
<?php

/**
 * A script to clean product formatted content in DB
 */
use Application\Model\Product;
use Application\Utility;

require_once 'server/cli.php';

function cleanFormattedContent(): void
{
    $connection = _em()->getConnection();
    $products = _em()->getRepository(Product::class)->getFormattedContents();
    $count = 0;
    $total = count($products);
    foreach ($products as $i => $row) {
        if ($i === 0 || $i % 200 === 0) {
            echo $i . '/' . $total . PHP_EOL;
        }

        $content = strip_tags($row['content']);

        $description = Utility::sanitizeRichText($row['description']);
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
            '~<p><a href="[^"]*">Aller à la version numérique</a></p>~' => '',
            '~<p class="petit"><a href="[^"]*">Aller à la version numérique</a></p>~' => '',
            '~<a href="[^"]*" target="_blank">Aller à la version numérique</a></p>~' => '',
            '~ style="[^"]*"~' => '',
            '~ class="[^"]*"~' => '',
            '~href="https://www\.larevuedurable\.com/fr/[^/]+/(\d+)-[^/]+\.html"~' => 'href="/larevuedurable/article/$1"',
        ];
        $description = preg_replace(array_keys($pregReplacements), array_values($pregReplacements), $description);

        if ($description !== $row['description'] || $content !== $row['content']) {
            $count += $connection->update('product', ['description' => $description, 'content' => $content], ['id' => $row['id']]);
        }
    }

    echo '
Updated records in DB: ' . $count . '
';
}

cleanFormattedContent();

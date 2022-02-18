<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */
return [
    'hostname' => 'artisans.lan',
    'email' => [
        'from' => 'noreply@artisans.lan',
        'toOverride' => null,
        'admins' => [], // admin emails to notify of orders, members and newsletter subscriptions...
    ],
    'smtp' => null,
    'phpPath' => '/usr/bin/php8.1',
    'templates' => [
        'paths' => [
            'app' => ['server/templates/app'],
            'error' => ['server/templates/error'],
            'layout' => ['server/templates/layout'],
        ],
    ],
    'view_helpers' => [
        'invokables' => [
            'orderLines' => \Application\View\Helper\OrderLines::class,
            'userInfos' => \Application\View\Helper\UserInfos::class,
            'orderBillingAddress' => \Application\View\Helper\OrderBillingAddress::class,
        ],
    ],
    'banking' => [
        'bankAccount' => '',
        'postAccount' => '',
        'paymentTo' => '',
        'paymentFor' => '',
    ],
];

<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */
return [
    'hostname' => 'artisans.lan',
    'fromEmail' => 'noreply@artisans.lan',
    'emailOverride' => null,
    'smtp' => null,
    'phpPath' => '/usr/bin/php7.4',
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

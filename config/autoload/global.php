<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */
return [
    'hostname' => 'artisans.lan',
    'baseUrl' => 'https://artisans.lan',
    'datatrans' => [
        'merchantId' => '',
        'key' => 'secret-HMAC-key',
        'production' => false,
        'endpoint' => 'https://pay.sandbox.datatrans.com',
    ],
    'email' => [
        'from' => 'noreply@artisans.lan',
        'toOverride' => null,
        'admins' => [], // admin emails to notify of orders, members and newsletter subscriptions...
    ],
    'smtp' => null,
    'phpPath' => '/usr/bin/php8.2',
    'templates' => [
        'paths' => [
            'app' => ['server/templates/app'],
            'error' => ['server/templates/error'],
            'layout' => ['server/templates/layout'],
        ],
    ],
    'view_helpers' => [
        'invokables' => [
            'orderLines' => Application\View\Helper\OrderLines::class,
            'userInfos' => Application\View\Helper\UserInfos::class,
            'orderBillingAddress' => Application\View\Helper\OrderBillingAddress::class,
        ],
    ],
    'banking' => [
        'bankAccount' => '',
        'postAccount' => '',
        'paymentTo' => '',
        'paymentFor' => '',
    ],
    'log' => [
        'url' => null, // URL to log server
        'emails' => [], // List of developer emails to send bugs to
    ],
    'sitemapStaticPages' => [
        '/association/nos-convictions',
        '/association/qui-sommes-nous',
        '/association/statuts',
        '/association/partenariats',
        '/actualite',
        '/contact',
        '/larevuedurable/projet',
        '/larevuedurable/points-de-vente',
        '/larevuedurable/abonnements',
        '/agir-avec-nous/toutes-nos-actions',
        '/agir-avec-nous/conversation-carbone/methode',
        '/agir-avec-nous/conversation-carbone/prochaines',
        '/agir-avec-nous/conversation-carbone/organisations',
        '/agir-avec-nous/conversation-carbone/facilitateurs',
        '/agir-avec-nous/desinvestir/industrie-energies-fossiles',
        '/agir-avec-nous/desinvestir/rapport-bns',
        '/agir-avec-nous/desinvestir/atelier-finance',
        '/agir-avec-nous/numerique-ethique',
        '/agir-avec-nous/alimentation',
        '/agir-avec-nous/agir-au-quotidien',
        '/nous-soutenir/faire-un-don',
        '/nous-soutenir/rejoindre-association',
        '/nous-soutenir/offrir-la-revue-durable',
        '/nous-soutenir/nous-faire-connaitre',
        '/agenda',
        '/mentions-legales',
        '/cgv',
    ],
];

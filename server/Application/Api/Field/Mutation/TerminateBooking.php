<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Api\Helper;
use Application\DBAL\Types\BookingStatusType;
use Application\Model\Booking;
use Application\Utility;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class TerminateBooking implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'terminateBooking',
            'type' => Type::nonNull(_types()->getOutput(Booking::class)),
            'description' => 'Terminate a booking',
            'args' => [
                'id' => Type::nonNull(_types()->getId(Booking::class)),
                'comment' => Type::string(),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): Booking {
                $booking = $args['id']->getEntity();

                // Check ACL
                Helper::throwIfDenied($booking, 'update');

                // Booking can only be terminated once
                if (!$booking->getEndDate()) {
                    $booking->setEndDate(Utility::getNow());
                    $booking->setStatus(BookingStatusType::BOOKED);
                    if (@$args['comment']) {
                        $booking->setEndComment($args['comment']);
                    }
                    _em()->flush();
                }

                return $booking;
            },
        ];
    }
}

<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class BookingTest extends TestCase
{
    public function testOwnerRelation(): void
    {
        $booking = new Booking();
        self::assertNull($booking->getOwner(), 'booking should have no owner');

        $user = new User();
        self::assertCount(0, $user->getBookings(), 'user should have no bookings');

        $booking->setOwner($user);
        self::assertCount(1, $user->getBookings(), 'user should have the added booking');
        self::assertSame($booking, $user->getBookings()->first(), 'user should have the same booking');
        self::assertSame($user, $booking->getOwner(), 'booking should have owner');
    }

    public function testBookableRelation(): void
    {
        $booking = new Booking();

        $bookable = new Bookable();
        self::assertCount(0, $bookable->getBookings(), 'bookable should have no bookings');

        $booking->setBookable($bookable);
        self::assertCount(1, $bookable->getBookings(), 'bookable should have the added booking');
        self::assertSame($booking, $bookable->getBookings()->first(), 'bookable should have the same booking');
        self::assertSame($bookable, $booking->getBookable(), 'booking should be able to retrieve added bookable');

        $booking->setBookable($bookable);
        self::assertCount(1, $bookable->getBookings(), 'bookable should still have exactly 1 booking');
        self::assertSame($booking, $bookable->getBookings()->first(), 'bookable should have the same booking');
        self::assertSame($bookable, $booking->getBookable(), 'booking should still have the same unique bookable');

        $bookable2 = new Bookable();
        $booking->setBookable($bookable2);
        self::assertCount(0, $bookable->getBookings(), 'bookable should not have any booking anymore');
        self::assertCount(1, $bookable2->getBookings(), 'bookable2 should have a new booking');
        self::assertSame($bookable2, $booking->getBookable(), 'booking should have only the second bookable left');
    }
}

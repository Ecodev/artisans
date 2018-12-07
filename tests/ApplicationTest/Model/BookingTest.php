<?php

declare(strict_types=1);

namespace ApplicationTest\Model;

use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\User;
use PHPUnit\Framework\TestCase;

class BookingTest extends TestCase
{
    public function testResponsibleRelation(): void
    {
        $booking = new Booking();
        self::assertNull($booking->getResponsible(), 'booking should have no responsible');

        $user = new User();
        self::assertCount(0, $user->getBookings(), 'user should have no bookings');

        $booking->setResponsible($user);
        self::assertCount(1, $user->getBookings(), 'user should have the added booking');
        self::assertSame($booking, $user->getBookings()->first(), 'user should have the same booking');
        self::assertSame($user, $booking->getResponsible(), 'booking should have responsible');

        $booking->setResponsible(null);
        self::assertNull($booking->getResponsible(), 'booking should have no responsible anymore');
    }

    public function testBookableRelation(): void
    {
        $booking = new Booking();
        self::assertCount(0, $booking->getBookables(), 'booking should have no bookables');

        $bookable = new Bookable();
        self::assertCount(0, $bookable->getBookings(), 'bookable should have no bookings');

        $booking->addBookable($bookable);
        self::assertCount(1, $bookable->getBookings(), 'bookable should have the added booking');
        self::assertSame($booking, $bookable->getBookings()->first(), 'bookable should have the same booking');
        self::assertCount(1, $booking->getBookables(), 'booking should have the added bookable');
        self::assertSame($bookable, $booking->getBookables()->first(), 'booking should be able to retrieve added bookable');

        $booking->addBookable($bookable);
        self::assertCount(1, $bookable->getBookings(), 'bookable should still have exactly 1 booking');
        self::assertCount(1, $booking->getBookables(), 'booking should still have the same unique bookable');

        $bookable2 = new Bookable();
        $booking->addBookable($bookable2);
        self::assertCount(2, $booking->getBookables(), 'should be able to add second bookable');

        $booking->removeBookable($bookable);
        self::assertCount(0, $bookable->getBookings(), 'bookable should not have any booking anymore');
        self::assertCount(1, $booking->getBookables(), 'booking should be able to remove first bookable');
        self::assertSame($bookable2, $booking->getBookables()->first(), 'booking should have only the second bookable left');
    }
}

<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Booking;
use Application\Model\User;
use Application\Repository\BookingRepository;

class BookingRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var BookingRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Booking::class);
    }

    public function testGetAllToInvoice(): void
    {
        $user = _em()->getRepository(User::class)->getByLogin('administrator');
        User::setCurrent($user);

        $bookings = $this->repository->getAllToInvoice();
        $actual = [];
        foreach ($bookings as $a) {
            $actual[] = $a->getId();
        }

        $expected = [
            4004,
            4005,
        ];

        self::assertSame($expected, $actual);
    }
}

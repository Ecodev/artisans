<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\DBAL\Types\BookingStatusType;
use Application\DBAL\Types\BookingTypeType;
use Application\Model\Bookable;
use Application\Model\Booking;
use Application\Model\User;
use Cake\Chronos\Date;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\Query\ResultSetMappingBuilder;

class BookingRepository extends AbstractRepository
{
    /**
     * All non-terminated bookings
     *     for active, periodic bookable
     *     for active member/responsible/administrator
     *     but that do not already have an existing transaction_line in the user account for this year
     *
     * @return Booking[]
     */
    public function getAllToInvoice(): array
    {
        $rsm = new ResultSetMappingBuilder($this->getEntityManager(), ResultSetMappingBuilder::COLUMN_RENAMING_INCREMENT);
        $rsm->addRootEntityFromClassMetadata(Booking::class, 'booking');
        $rsm->addJoinedEntityFromClassMetadata(Bookable::class, 'bookable', 'booking', 'bookable');
        $selectClause = $rsm->generateSelectClause();

        $sql = "
            SELECT $selectClause FROM booking
            JOIN bookable ON booking.bookable_id = bookable.id
            JOIN user ON booking.owner_id = user.id AND user.role IN (:roles)
            LEFT JOIN account ON user.id = account.owner_id
            LEFT JOIN transaction_line ON
                account.id = transaction_line.debit_id
                AND transaction_line.bookable_id = bookable.id
                AND transaction_line.transactionDate >= :currentYear
                AND transaction_line.transactionDate < :nextYear
            WHERE
            user.status IN (:userStatus)
            AND bookable.booking_type IN (:bookingType)
            AND booking.status = :bookingStatus
            AND booking.start_date < :nextYear
            AND (booking.end_date IS NULL OR booking.end_date >= :nextYear)
            AND bookable.is_active
            AND bookable.periodic_price != 0
            AND transaction_line.id IS NULL
            ORDER BY booking.owner_id ASC, bookable.name ASC
        ";

        $query = $this->getEntityManager()->createNativeQuery($sql, $rsm)
            ->setParameter('bookingType', [BookingTypeType::MANDATORY, BookingTypeType::ADMIN_ONLY], Connection::PARAM_STR_ARRAY)
            ->setParameter('bookingStatus', BookingStatusType::BOOKED)
            ->setParameter('userStatus', [User::STATUS_ACTIVE, User::STATUS_INACTIVE], Connection::PARAM_STR_ARRAY)
            ->setParameter('currentYear', Date::now()->firstOfYear()->toDateString())
            ->setParameter('nextYear', Date::now()->firstOfYear()->addYear()->toDateString())
            ->setParameter('roles', [User::ROLE_MEMBER, User::ROLE_RESPONSIBLE, User::ROLE_ADMINISTRATOR], Connection::PARAM_STR_ARRAY);

        $result = $query->getResult();

        return $result;
    }
}

<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\AccountingDocument;
use Application\Model\ExpenseClaim;
use Application\Model\User;
use Application\Repository\AccountingDocumentRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;
use Money\Money;

/**
 * @group Repository
 */
class AccountingDocumentRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    /**
     * @var AccountingDocumentRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(AccountingDocument::class);
    }

    public function providerGetAccessibleSubQuery(): array
    {
        $all = [9000, 9001];
        $family = [9000];

        return [
            ['anonymous', []],
            ['individual', $family],
            ['member', $family],
            ['responsible', $all],
            ['administrator', $all],
        ];
    }

    public function testFileOnDiskIsDeletedWhenRecordInDbIsDeleted(): void
    {
        $expenseClaim = new ExpenseClaim();
        $document = new AccountingDocument();
        $user = new User();

        $expenseClaim->setOwner($user);
        $expenseClaim->setAmount(Money::CHF(10000));
        $expenseClaim->setName('steaks');
        $document->setExpenseClaim($expenseClaim);
        $document->setFilename('test document.pdf');
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->persist($expenseClaim);
        $this->getEntityManager()->persist($document);
        $this->getEntityManager()->flush();

        $path = $document->getPath();
        touch($path);
        self::assertFileExists($path, 'test file must exist, because we just touch()ed it');

        $this->getEntityManager()->remove($document);
        $this->getEntityManager()->flush();
        self::assertFileNotExists($path, 'test file must have been deleted when record was deleted');
    }
}

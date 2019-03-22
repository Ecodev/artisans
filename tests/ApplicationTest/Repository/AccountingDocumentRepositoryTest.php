<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\AccountingDocument;
use Application\Model\ExpenseClaim;
use Application\Model\User;
use Application\Repository\AccountingDocumentRepository;

/**
 * @group Repository
 */
class AccountingDocumentRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var AccountingDocumentRepository
     */
    private $repository;

    /**
     * @var ExpenseClaim
     */
    private $expenseClaim;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(AccountingDocument::class);
    }

    public function testFileOnDiskIsDeletedWhenRecordInDbIsDeleted(): void
    {
        $expenseClaim = new ExpenseClaim();
        $document = new AccountingDocument();
        $user = new User();

        $expenseClaim->setOwner($user);
        $expenseClaim->setAmount('100');
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
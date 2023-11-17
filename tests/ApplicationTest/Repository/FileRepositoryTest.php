<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\DBAL\Types\ProductTypeType;
use Application\Model\File;
use Application\Model\Product;
use Application\Repository\FileRepository;
use ApplicationTest\Traits\LimitedAccessSubQuery;
use Cake\Chronos\ChronosDate;

class FileRepositoryTest extends AbstractRepositoryTest
{
    use LimitedAccessSubQuery;

    private FileRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(File::class);
    }

    public function providerGetAccessibleSubQuery(): iterable
    {
        $all = [9000, 9001, 9002, 9003];
        $articlesAndReviewsViaSubscriptions = [9000, 9001, 9002, 9003];
        $directPurchases = [9001, 9003];
        yield ['anonymous', [9003]];
        yield ['member', $directPurchases];
        yield ['othermember', $articlesAndReviewsViaSubscriptions];
        yield ['facilitator', $all];
        yield ['administrator', $all];
    }

    public function testFileOnDiskIsDeletedWhenRecordInDbIsDeleted(): void
    {
        $product = new Product('p1');
        $product->setReleaseDate(new ChronosDate());
        $product->setReviewNumber(1);
        $product->setType(ProductTypeType::BOTH);
        $file = new File();

        $file->setFilename('test document.pdf');
        $product->setFile($file);

        $this->getEntityManager()->persist($product);
        $this->getEntityManager()->persist($file);
        $this->getEntityManager()->flush();

        $path = $file->getPath();
        touch($path);
        self::assertFileExists($path, 'test file must exist, because we just touch()ed it');

        $this->getEntityManager()->remove($file);
        $this->getEntityManager()->flush();
        self::assertFileDoesNotExist($path, 'test file must have been deleted when record was deleted');
    }
}

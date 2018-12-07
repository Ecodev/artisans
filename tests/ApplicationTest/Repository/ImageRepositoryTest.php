<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Image;
use Application\Repository\ImageRepository;

/**
 * @group Repository
 */
class ImageRepositoryTest extends AbstractRepositoryTest
{
    /**
     * @var ImageRepository
     */
    private $repository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Image::class);
    }

    public function testImageOnDiskIsDeletedWhenRecordInDbIsDeleted(): void
    {
        $image = new Image();

        $image->setFilename('test image.jpg');
        $this->getEntityManager()->persist($image);
        $this->getEntityManager()->flush();

        $path = $image->getPath();
        touch($path);
        self::assertFileExists($path, 'test file must exist, because we just touch()ed it');

        $this->getEntityManager()->remove($image);
        $this->getEntityManager()->flush();
        self::assertFileNotExists($path, 'test file must have been deleted when record was deleted');
    }
}

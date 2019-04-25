<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Image;
use Application\Model\Product;
use Application\Repository\ImageRepository;
use Application\Service\AbstractDatabase;

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

    public function tearDown(): void
    {
        // Restore all images that might have been deleted
        AbstractDatabase::executeLocalCommand('git checkout -- data/images/');
        parent::tearDown();
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

    public function testDoctrineDoesNotFuckUpAndDeleteImageFromUnrelatedProduct(): void
    {
        // Make one image usable
        $this->getEntityManager()->getConnection()->update('product', ['image_id' => null], ['image_id' => 5007]);

        $paths = [
            'data/images/chocolat1.jpg',
            'data/images/chocolat2.jpg',
            'data/images/miel.png',
            'data/images/oeufs.jpg',
            'data/images/patates.jpg',
            'data/images/poire.jpg',
            'data/images/pomme.jpg',
            'data/images/salade.jpg',
            'data/images/vin1.jpg',
            'data/images/vin2.jpg',
            'data/images/yogourt1.jpg',
            'data/images/yogourt2.png',
        ];

        // All images must exist before testing
        foreach ($paths as $p) {
            self::assertFileExists($p);
        }

        // Image that will be orphaned must exist in DB
        $imageToBeOrphanedQuery = 'SELECT COUNT(*) FROM image WHERE id = 5000';
        self::assertSame('1', $this->getEntityManager()->getConnection()->fetchColumn($imageToBeOrphanedQuery));

        // Affect existing image to an existing product
        $product = $this->getEntityManager()->find(Product::class, 3000);
        $image = $this->getEntityManager()->find(Image::class, 5007);
        self::assertNotNull($image);
        $product->setImage($image);
        self::assertSame($image, $product->getImage(), 'should get image that was set');
        $this->getEntityManager()->flush();

        // Most images must still exist after affecting an existing image to an existing product.
        // Only the orphaned image should be deleted, but absolutely never an image related to **another** product
        $mustBeDeleted = 'data/images/chocolat1.jpg';
        foreach ($paths as $p) {
            if ($p === $mustBeDeleted) {
                self::assertFileNotExists($p);
            } else {
                self::assertFileExists($p);
            }
        }

        // Orphaned image was deleted from DB
        self::assertSame('0', $this->getEntityManager()->getConnection()->fetchColumn($imageToBeOrphanedQuery));
    }
}

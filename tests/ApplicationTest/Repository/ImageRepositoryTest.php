<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Model\Image;
use Application\Model\Product;
use Application\Model\User;
use Application\Repository\ImageRepository;
use Ecodev\Felix\Service\AbstractDatabase;

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
        self::assertFileDoesNotExist($path, 'test file must have been deleted when record was deleted');
    }

    public function testDoctrineDoesNotFuckUpAndDeleteImageFromUnrelatedProduct(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByEmail('administrator@example.com');
        User::setCurrent($user);

        // Make one image usable
        $this->getEntityManager()->getConnection()->update('product', ['image_id' => null], ['image_id' => 5007]);
        $this->getEntityManager()->getConnection()->exec('REPLACE INTO image (id, filename, width, height) VALUES(5999, \'foo.svg\', 113, 86);');

        $paths = [
            'data/images/train.jpg',
            'data/images/revue61.jpg',
            'data/images/revue62.jpg',
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
        $image = $this->getEntityManager()->find(Image::class, 5999);
        self::assertNotNull($image);
        $product->setImage($image);
        self::assertSame($image, $product->getImage(), 'should get image that was set');
        $this->getEntityManager()->flush();

        // Most images must still exist after affecting an existing image to an existing product.
        // Only the orphaned image should be deleted, but absolutely never an image related to **another** product
        $mustBeDeleted = 'data/images/revue61.jpg';
        foreach ($paths as $p) {
            if ($p === $mustBeDeleted) {
                self::assertFileDoesNotExist($p);
            } else {
                self::assertFileExists($p);
            }
        }

        // Orphaned image was deleted from DB
        self::assertSame('0', $this->getEntityManager()->getConnection()->fetchColumn($imageToBeOrphanedQuery));
    }
}

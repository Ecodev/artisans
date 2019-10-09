<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasOrderType;
use Doctrine\ORM\Mapping as ORM;

/**
 * Give a user access to a product.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\UserProductRepository")
 */
class UserProduct extends AbstractModel
{
    use HasOrderType;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $user;

    /**
     * @var Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $product;

    /**
     * Set user
     *
     * @param User $user
     */
    public function setUser(User $user): void
    {
        $this->user = $user;
    }

    /**
     * Get user
     *
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * Set product
     *
     * @param Product $product
     */
    public function setProduct(Product $product): void
    {
        $this->product = $product;
    }

    /**
     * Get product
     *
     * @return Product
     */
    public function getProduct(): Product
    {
        return $this->product;
    }
}

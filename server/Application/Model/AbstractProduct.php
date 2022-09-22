<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasCode;
use Application\Traits\HasProductType;
use Application\Traits\HasRichTextDescription;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasInternalRemarks;
use Ecodev\Felix\Model\Traits\HasName;
use GraphQL\Doctrine\Annotation as API;
use Money\Money;

/**
 * An item that can be booked by a user.
 *
 * @ORM\MappedSuperclass
 */
abstract class AbstractProduct extends AbstractModel
{
    use HasCode;
    use HasInternalRemarks;
    use HasName;
    use HasProductType;
    use HasRichTextDescription;

    /**
     * @ORM\Column(type="CHF", options={"default" = "0"})
     */
    private Money $pricePerUnitCHF;

    /**
     * @ORM\Column(type="EUR", options={"default" = "0"})
     */
    private Money $pricePerUnitEUR;

    /**
     * @ORM\Column(type="boolean", options={"default" = 1})
     */
    private bool $isActive = true;

    /**
     * @ORM\OneToOne(targetEntity="Image", orphanRemoval=true)
     * @ORM\JoinColumn(name="image_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private ?Image $image = null;

    /**
     * @ORM\OneToOne(targetEntity="Image", orphanRemoval=true)
     * @ORM\JoinColumn(name="illustration_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private ?Image $illustration = null;

    public function __construct(string $name = '')
    {
        $this->setName($name);
        $this->pricePerUnitCHF = Money::CHF(0);
        $this->pricePerUnitEUR = Money::EUR(0);
    }

    /**
     * @API\Field(type="CHF")
     */
    public function getPricePerUnitCHF(): Money
    {
        return $this->pricePerUnitCHF;
    }

    /**
     * @API\Input(type="CHF")
     */
    public function setPricePerUnitCHF(Money $pricePerUnitCHF): void
    {
        $this->pricePerUnitCHF = $pricePerUnitCHF;
    }

    /**
     * @API\Field(type="EUR")
     */
    public function getPricePerUnitEUR(): Money
    {
        return $this->pricePerUnitEUR;
    }

    /**
     * @API\Input(type="EUR")
     */
    public function setPricePerUnitEUR(Money $pricePerUnitEUR): void
    {
        $this->pricePerUnitEUR = $pricePerUnitEUR;
    }

    /**
     * Whether this product can be bought.
     */
    public function isActive(): bool
    {
        return $this->isActive;
    }

    /**
     * Whether this product can be bought.
     */
    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): void
    {
        // We must trigger lazy loading, otherwise Doctrine will seriously
        // mess up lifecycle callbacks and delete unrelated image on disk
        if ($this->image) {
            $this->image->getFilename();
        }

        $this->image = $image;
    }

    public function getIllustration(): ?Image
    {
        return $this->illustration;
    }

    public function setIllustration(?Image $illustration): void
    {
        // We must trigger lazy loading, otherwise Doctrine will seriously
        // mess up lifecycle callbacks and delete unrelated illustration on disk
        if ($this->illustration) {
            $this->illustration->getFilename();
        }

        $this->illustration = $illustration;
    }
}

<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * A document attesting an expense claim
 *
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="Application\Repository\AccountingDocumentRepository")
 */
class AccountingDocument extends AbstractFile
{
    protected function getBasePath(): string
    {
        return 'data/accounting/';
    }

    protected function getAcceptedMimeTypes(): array
    {
        return [
            'image/bmp',
            'image/gif',
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/webp',
            'application/pdf',
            'application/x-pdf',
        ];
    }

    /**
     * @var ExpenseClaim
     *
     * @ORM\ManyToOne(targetEntity="ExpenseClaim", inversedBy="accountingDocuments")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $expenseClaim;

    /**
     * @param ExpenseClaim $expenseClaim
     */
    public function setExpenseClaim(ExpenseClaim $expenseClaim): void
    {
        if ($this->expenseClaim && $expenseClaim !== $this->expenseClaim) {
            $this->expenseClaim->accountingDocumentRemoved($this);
        }

        $this->expenseClaim = $expenseClaim;
        $expenseClaim->accountingDocumentAdded($this);
    }

    /**
     * @return ExpenseClaim
     */
    public function getExpenseClaim(): ExpenseClaim
    {
        return $this->expenseClaim;
    }
}

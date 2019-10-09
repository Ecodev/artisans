<?php

declare(strict_types=1);

namespace Application\Model;

use Cake\Chronos\Chronos;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;

/**
 * A message sent to a user
 *
 * @ORM\Entity(repositoryClass="Application\Repository\MessageRepository")
 */
class Message extends AbstractModel
{
    /**
     * @var null|User
     *
     * @ORM\ManyToOne(targetEntity="User", inversedBy="messages")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(onDelete="CASCADE")
     * })
     */
    private $recipient;

    /**
     * @var string
     * @ORM\Column(type="string", length=191)
     */
    private $email;

    /**
     * @var string
     *
     * @ORM\Column(type="MessageType")
     */
    private $type;

    /**
     * @var null|Chronos
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $dateSent;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=255, options={"default" = ""})
     */
    private $subject = '';

    /**
     * @var string
     *
     * @ORM\Column(type="text", length=65535, options={"default" = ""})
     */
    private $body = '';

    /**
     * Set recipient
     *
     * @param null|User $recipient
     */
    public function setRecipient(?User $recipient): void
    {
        if ($this->recipient) {
            $this->recipient->messageRemoved($this);
        }

        $this->recipient = $recipient;
        $this->setOwner($recipient);

        if ($this->recipient) {
            $this->recipient->messageAdded($this);
        }
    }

    /**
     * Get recipient
     *
     * @return null|User
     */
    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    /**
     * Set type
     *
     * @API\Input(type="MessageType")
     *
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * Get type
     *
     * @API\Field(type="MessageType")
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getSubject(): string
    {
        return $this->subject;
    }

    /**
     * @param string $subject
     */
    public function setSubject(string $subject): void
    {
        $this->subject = $subject;
    }

    /**
     * @return string
     */
    public function getBody(): string
    {
        return $this->body;
    }

    /**
     * @param string $body
     */
    public function setBody(string $body): void
    {
        $this->body = $body;
    }

    /**
     * Get sent time
     *
     * @return null|Chronos
     */
    public function getDateSent(): ?Chronos
    {
        return $this->dateSent;
    }

    /**
     * Set sent time
     *
     * @API\Exclude
     *
     * @param null|Chronos $dateSent
     */
    public function setDateSent(?Chronos $dateSent): void
    {
        $this->dateSent = $dateSent;
    }

    /**
     * Recipient email address
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Recipient email address
     *
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }
}

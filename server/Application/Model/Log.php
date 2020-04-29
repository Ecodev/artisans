<?php

declare(strict_types=1);

namespace Application\Model;

use Doctrine\ORM\Mapping as ORM;

/**
 * Log
 *
 * @ORM\Table(indexes={
 *     @ORM\Index(name="priority", columns={"creation_date"}),
 *     @ORM\Index(name="date_created", columns={"creation_date"}),
 *     @ORM\Index(name="message", columns={"message"}, options={"lengths" = {191}})
 * })
 * @ORM\Entity(repositoryClass="Application\Repository\LogRepository")
 */
class Log extends AbstractModel
{
    use \Application\Traits\HasUrl;

    /**
     * @var int
     *
     * @ORM\Column(type="smallint")
     */
    private $priority;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=5000, nullable=false)
     */
    private $message;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=500, nullable=false)
     */
    private $referer;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=1000, nullable=false)
     */
    private $request;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=40, nullable=false)
     */
    private $ip;

    /**
     * The statistics data
     *
     * @var array
     *
     * @API\Exclude
     *
     * @ORM\Column(type="json_array")
     */
    private $extra = [];

    /**
     * Set priority
     *
     * @param int $priority
     */
    public function setPriority(int $priority): void
    {
        $this->priority = $priority;
    }

    /**
     * Get priority
     *
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Set message
     *
     * @param string $message
     */
    public function setMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     * Get message
     *
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * Set referer
     *
     * @param string $referer
     */
    public function setReferer(string $referer): void
    {
        $this->referer = $referer;
    }

    /**
     * Get referer
     *
     * @return string
     */
    public function getReferer(): string
    {
        return $this->referer;
    }

    /**
     * Set request
     *
     * @param string $request
     */
    public function setRequest(string $request): void
    {
        $this->request = $request;
    }

    /**
     * Get request
     *
     * @return string
     */
    public function getRequest(): string
    {
        return $this->request;
    }

    /**
     * Set ip
     *
     * @param string $ip
     */
    public function setIp(string $ip): void
    {
        $this->ip = $ip;
    }

    /**
     * Get ip
     *
     * @return string
     */
    public function getIp(): string
    {
        return $this->ip;
    }

    /**
     * @return array
     */
    public function getExtra(): array
    {
        return $this->extra;
    }

    /**
     * @param array $extra
     */
    public function setExtra(array $extra): void
    {
        $this->extra = $extra;
    }
}

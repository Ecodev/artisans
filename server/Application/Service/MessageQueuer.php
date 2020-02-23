<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\User;
use Doctrine\ORM\EntityManager;
use Laminas\View\Model\ViewModel;
use Laminas\View\Renderer\RendererInterface;

/**
 * Service to queue new message for pre-defined purposes
 */
class MessageQueuer
{
    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var string
     */
    private $hostname;

    /**
     * @var RendererInterface
     */
    private $viewRenderer;

    public function __construct(EntityManager $entityManager, RendererInterface $viewRenderer, string $hostname)
    {
        $this->entityManager = $entityManager;
        $this->hostname = $hostname;
        $this->viewRenderer = $viewRenderer;
    }

    public function queueRegister(User $user): Message
    {
        $subject = 'Demande de création de compte Les artisans de la transition';
        $mailParams = [
            'token' => $user->createToken(),
        ];

        $message = $this->createMessage($user, $user->getEmail(), $subject, MessageTypeType::REGISTER, $mailParams);

        return $message;
    }

    public function queueConfirmedRegistration(User $admin, User $registeredUser): Message
    {
        $subject = 'Nouveau membre';
        $mailParams = [
            'registeredUser' => $registeredUser,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::CONFIRMED_REGISTRATION, $mailParams);

        return $message;
    }

    public function queueUnregister(User $admin, User $unregisteredUser): Message
    {
        $subject = 'Démission';
        $mailParams = [
            'unregisteredUser' => $unregisteredUser,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::UNREGISTER, $mailParams);

        return $message;
    }

    /**
     * Queue a reset password email to specified user
     *
     * @param User $user The user for which a password reset will be done
     * @param string $email the address to send the email to. Might be different than the user's email
     *
     * @return Message
     */
    public function queueResetPassword(User $user, string $email): Message
    {
        $subject = 'Demande de modification de mot de passe';
        $mailParams = [
            'token' => $user->createToken(),
        ];

        $message = $this->createMessage($user, $email, $subject, MessageTypeType::RESET_PASSWORD, $mailParams);

        return $message;
    }

    public function queueUpdatedUser(User $admin, User $updatedUser, array $before, array $after): Message
    {
        $subject = 'Un utilisateur a modifié ses données personnelles';
        $mailParams = [
            'updatedUser' => $updatedUser,
            'before' => $before,
            'after' => $after,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::UPDATED_USER, $mailParams);

        return $message;
    }

    public function queueUserPendingOrder(Order $order): Message
    {
        $subject = 'Votre commande est en cours de traitement';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($order->getOwner(), $order->getOwner()->getEmail(), $subject, MessageTypeType::USER_PENDING_ORDER, $mailParams);

        return $message;
    }

    public function queueUserValidatedOrder(Order $order): Message
    {
        $subject = 'Votre commande a été validée';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($order->getOwner(), $order->getOwner()->getEmail(), $subject, MessageTypeType::USER_VALIDATED_ORDER, $mailParams);

        return $message;
    }

    public function queueAdminPendingOrder(User $admin, Order $order): Message
    {
        $subject = 'Une commande a besoin d\'un BVR';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::ADMIN_PENDING_ORDER, $mailParams);

        return $message;
    }

    public function queueAdminValidatedOrder(User $admin, Order $order): Message
    {
        $subject = 'Commande à comptabiliser';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::ADMIN_VALIDATED_ORDER, $mailParams);

        return $message;
    }

    /**
     * Create a message by rendering the template
     *
     * @param null|User $user
     * @param string $email
     * @param string $subject
     * @param string $type
     * @param array $mailParams
     *
     * @return Message
     */
    private function createMessage(?User $user, string $email, string $subject, string $type, array $mailParams): Message
    {
        // First render the view
        $serverUrl = 'https://' . $this->hostname;
        $model = new ViewModel($mailParams);
        $model->setTemplate(str_replace('_', '-', $type));
        $model->setVariable('email', $email);
        $model->setVariable('user', $user);
        $model->setVariable('serverUrl', $serverUrl);
        $partialContent = $this->viewRenderer->render($model);

        // Then inject it into layout
        $layoutModel = new ViewModel([$model->captureTo() => $partialContent]);
        $layoutModel->setTemplate('layout');
        $layoutModel->setVariable('subject', $subject);
        $layoutModel->setVariable('user', $user);
        $layoutModel->setVariable('serverUrl', $serverUrl);
        $layoutModel->setVariable('hostname', $this->hostname);
        $content = $this->viewRenderer->render($layoutModel);

        $message = new Message();
        $message->setType($type);
        $message->setRecipient($user);
        $message->setSubject($subject);
        $message->setBody($content);
        $message->setEmail($email);
        $this->entityManager->persist($message);

        return $message;
    }
}

<?php

declare(strict_types=1);

namespace Application\Service;

use Application\DBAL\Types\MessageTypeType;
use Application\Model\Message;
use Application\Model\Order;
use Application\Model\User;
use Doctrine\ORM\EntityManager;
use Ecodev\Felix\Service\MessageRenderer;

/**
 * Service to queue new message for pre-defined purposes
 */
class MessageQueuer
{
    private EntityManager $entityManager;

    private MessageRenderer $messageRenderer;

    public function __construct(EntityManager $entityManager, MessageRenderer $messageRenderer)
    {
        $this->entityManager = $entityManager;
        $this->messageRenderer = $messageRenderer;
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

    public function queueUserPendingOrder(User $user, Order $order): Message
    {
        $subject = 'Votre commande est en cours de traitement';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($user, $user->getEmail(), $subject, MessageTypeType::USER_PENDING_ORDER, $mailParams);

        return $message;
    }

    public function queueUserValidatedOrder(User $user, Order $order): Message
    {
        $subject = 'Votre commande a été validée';
        $mailParams = [
            'order' => $order,
        ];

        $message = $this->createMessage($user, $user->getEmail(), $subject, MessageTypeType::USER_VALIDATED_ORDER, $mailParams);

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

    public function queueRequestMembershipEnd(User $admin, User $member): Message
    {
        $subject = 'Demande d\'arrêt de cotisations';
        $mailParams = [
            'member' => $member,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::REQUEST_MEMBERSHIP_END, $mailParams);

        return $message;
    }

    public function queueNewsletterSubscription(User $admin, string $email): Message
    {
        $subject = 'Demande d\'inscription à la newsletter';
        $mailParams = [
            'newsletterEmail' => $email,
        ];

        $message = $this->createMessage($admin, $admin->getEmail(), $subject, MessageTypeType::NEWSLETTER_SUBSCRIPTION, $mailParams);

        return $message;
    }

    /**
     * Create a message by rendering the template
     */
    private function createMessage(?User $user, string $email, string $subject, string $type, array $mailParams): Message
    {
        $content = $this->messageRenderer->render($user, $email, $subject, $type, $mailParams);

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

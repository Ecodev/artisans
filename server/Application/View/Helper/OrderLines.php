<?php

declare(strict_types=1);

namespace Application\View\Helper;

use Application\Enum\ProductType;
use Application\Model\Order;
use Application\Model\OrderLine;
use Laminas\View\Helper\AbstractHelper;

class OrderLines extends AbstractHelper
{
    /**
     * This is used for custom admin and customer emails, so links must be frontend, not backend.
     */
    public function __invoke(Order $order): string
    {
        $result = '<ul>';

        /** @var OrderLine $line */
        foreach ($order->getOrderLines() as $line) {
            $label = $this->view->escapeHtml($line->getName());
            $price = ' <strong>' . $line->getFormattedBalance() . '</strong>';

            $type = '';
            switch ($line->getType()) {
                case ProductType::Both:
                    $type = ', papier et numérique';

                    break;
                case ProductType::Digital:
                    $type = ', numérique';

                    break;
                case ProductType::Paper:
                    $type = ', papier';

                    break;
            }

            if ($line->getProduct()) {
                $url = $this->view->serverUrl . '/larevuedurable/article/' . $line->getProduct()->getId();
                $label = '<a href="' . $url . '">' . $label . ', ' . $line->getProduct()->getCode() . '</a>';
            }

            if ($line->getSubscription()) {
                $url = $this->view->serverUrl . '/larevuedurable/abonnements';
                $label = '<a href="' . $url . '">' . $label . '</a>';
            }

            $extra = '';
            if ($line->getAdditionalEmails()) {
                $extra .= '<ul>';
                foreach ($line->getAdditionalEmails() as $email) {
                    $extra .= '<li>' . $this->view->escapeHtml($email) . '</li>';
                }
                $extra .= '</ul>';
            }

            $result .= '<li>' . $label . $type . $price . $extra . '</li>';
        }
        $result .= '</ul>';

        return $result;
    }
}

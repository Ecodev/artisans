<?php

declare(strict_types=1);

namespace Application\View\Helper;

use Application\Model\Order;
use Application\Model\OrderLine;
use Laminas\View\Helper\AbstractHelper;

class OrderLines extends AbstractHelper
{
    public function __invoke(Order $order): string
    {
        $result = '<ul>';

        /** @var OrderLine $line */
        foreach ($order->getOrderLines() as $line) {
            $label = $line->getName();
            if ($line->getProduct()) {
                $label = '<a href="' . $this->view->serverUrl . '/larevuedurable/article/' . $line->getProduct()->getId() . '">' . $label . '</a>';
            }

            $result .= '<li>' . $label . '</li>';
        }
        $result .= '</ul>';

        return $result;
    }
}

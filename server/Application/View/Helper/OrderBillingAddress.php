<?php

declare(strict_types=1);

namespace Application\View\Helper;

use Application\Model\Order;
use Laminas\View\Helper\AbstractHelper;

class OrderBillingAddress extends AbstractHelper
{
    public function __invoke(?Order $order): string
    {
        $result = '<ul>';
        $result .= '<li>' . $this->view->escapeHtml($order->getFirstName()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($order->getLastName()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($order->getStreet()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($order->getPostcode()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($order->getLocality()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($order->getCountry() ? $order->getCountry()->getName() : '') . '</li>';
        $result .= '</ul>';

        return $result;
    }
}

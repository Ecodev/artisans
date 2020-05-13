<?php

declare(strict_types=1);

namespace Application\View\Helper;

use Application\Model\User;
use Laminas\View\Helper\AbstractHelper;

class UserInfos extends AbstractHelper
{
    public function __invoke(?User $user): string
    {
        if (!$user) {
            return '<p>Utilisateur inconnu. Il a probablement été supprimé.</p>';
        }

        $url = $this->view->serverUrl . '/admin/user/' . $user->getId();

        $result = '<ul>';
        $result .= '<li>' . $this->view->escapeHtml($user->getFirstName()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($user->getLastName()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($user->getStreet()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($user->getPostcode()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($user->getLocality()) . '</li>';
        $result .= '<li>' . $this->view->escapeHtml($user->getCountry() ? $user->getCountry()->getName() : '') . '</li>';
        $result .= '<li><a href="mailto:' . $this->view->escapeHtmlAttr($user->getEmail()) . '">' . $this->view->escapeHtml($user->getEmail()) . '</a></li>';
        $result .= '<li><a href="' . $url . '">' . $this->view->escapeHtml($url) . '</a></li>';
        $result .= '</ul>';

        return $result;
    }
}

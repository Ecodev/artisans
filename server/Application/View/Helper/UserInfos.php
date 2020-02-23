<?php

declare(strict_types=1);

namespace Application\View\Helper;

use Application\Model\User;
use Laminas\View\Helper\AbstractHelper;

class UserInfos extends AbstractHelper
{
    public function __invoke(User $user): string
    {
        $url = $this->view->serverUrl . '/admin/user/' . $user->getId();

        $result = '<ul>';
        $result .= '<li>' . $user->getFirstName() . '</li>';
        $result .= '<li>' . $user->getLastName() . '</li>';
        $result .= '<li>' . $user->getStreet() . '</li>';
        $result .= '<li>' . $user->getPostcode() . '</li>';
        $result .= '<li>' . $user->getLocality() . '</li>';
        $result .= '<li>' . ($user->getCountry() ? $user->getCountry()->getName() : '') . '</li>';
        $result .= '<li><a href="mailto:' . $user->getEmail() . '">' . $user->getEmail() . '</a></li>';
        $result .= '<li><a href="' . $url . '">' . $url . '</a></li>';
        $result .= '</ul>';

        return $result;
    }
}

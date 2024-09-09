<?php

/**
 * $KYAULabs: hexforged.php,v 1.0.8 2024/09/09 00:22:36 -0700 kyau Exp $
 * ▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 * █ ▄▄ ▄ ▄▄▄▄ ▄▄ ▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄ ▄▄▄  ▀
 * █ ██ █ ██ ▀ ██ █ ██ ▀ ██ █ ██ █ ██    ██ ▀ ██ █ █
 * ▪ ██▄█ ██▀  ▀█▄▀ ██▀  ██ █ ██▄▀ ██ ▄▄ ██▀  ██ █ ▪
 * █ ██ █ ██ █ ██ █ ██   ██ █ ██ █ ██ ▀█ ██ █ ██ █ █
 * ▄ ▀▀ ▀ ▀▀▀▀ ▀▀ ▀ ▀▀   ▀▀▀▀ ▀▀ ▀ ▀▀▀▀▀ ▀▀▀▀ ▀▀▀▀ █
 * ▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
 *
 * Hexforged
 * Copyright (C) 2024 KYAU Labs (https://kyaulabs.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

namespace Hexforged;

require_once(__DIR__ . '/../../.env');
// backend
require_once(__DIR__ . '/../backend/account.php');
require_once(__DIR__ . '/../backend/metadata.php');
require_once(__DIR__ . '/../backend/sessions.php');
// layouts
require_once(__DIR__ . '/../layouts/account.php');
require_once(__DIR__ . '/../layouts/dashboard.php');
require_once(__DIR__ . '/../layouts/footer.php');
require_once(__DIR__ . '/../layouts/frontpage.php');
require_once(__DIR__ . '/../layouts/header.php');

$session ??= new Session(true);

if (isset($_POST['cmd']) && trim($_POST['cmd']) != '') {
    $cmd = strtolower(trim($_POST['cmd']));
    switch ($cmd) {
        case 'header':
            echo Layouts\Header::output('small');
            break;
        case 'header-medium':
            echo Layouts\Header::output('medium');
            break;
        case 'header-large':
            echo Layouts\Header::output('large');
            break;
        case 'footer':
            echo Layouts\Footer::output();
            break;
        case 'main':
            echo Layouts\Frontpage::output();
            break;
        case 'register':
            echo Layouts\Account::output('register');
            break;
        case 'login':
            echo Layouts\Account::output('login');
            break;
        case 'manage':
            echo Layouts\Account::output('manage');
            break;
        case 'verify':
            echo Layouts\Account::output('verify');
            break;
        case 'dashboard':
            echo Layouts\Dashboard::output();
            break;
        default:
            break;
    }
} else if (isset($_POST['form']) && trim($_POST['form']) != '') {
    $form = strtolower(trim($_POST['form']));
    switch ($form) {
        case 'account-create':
            echo Account::Create($_POST);
            break;
        case 'account-login':
            echo Account::Login($_POST);
            break;
        case 'account-verify':
            echo Account::Verify(htmlspecialchars($_POST['token']));
            break;
        default:
            break;
    }
} else {
    header('Location: https://hexforged.com');
}

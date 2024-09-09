<?php

/**
 * $KYAULabs: frontpage.php,v 1.0.0 2024/09/08 11:42:54 -0700 kyau Exp $
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

namespace Hexforged\Layouts;

require_once(__DIR__ . '/../../.env');
require_once(__DIR__ . '/../backend/account.php');

/**
 * Class Frontpage
 *
 * This class handles the HTML output for the Hexforged frontend frontpage.
 */
class Frontpage
{
    /**
     * Generates the main content HTML.
     *
     * @return string HTML code for <main/>.
     */
    public static function output(): string
    {
        $ret = '';
        if (!\Hexforged\Account::isUserLoggedIn()) {
            $ret = <<<EOF
        <p class="login-auth"><a href="/login">Login</a> <span>|</span> <a href="/register">Register</a></p>
        <br/><br/>
        <h5 class="hex-display__inline hex-align__center hex-color__red">Alpha Access Soon&trade;</h5>
EOF;
        } else {
            $ret = <<<EOF
        <br/><br/>
        <button type="submit" name="submit" id="enter-the-realm" class="hex-btn__submit hex-margin__top-one">
            <span>Enter the Realm</span>
        </button>
EOF;
        }
        return $ret;
    }
}
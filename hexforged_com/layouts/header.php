<?php

/**
 * $KYAULabs: header.php,v 1.0.0 2024/09/08 10:42:10 -0700 kyau Exp $
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
 * Class Header
 *
 * This class handles the HTML output for the Hexforged frontend header.
 */
class Header
{
    private static function getLogoImg(string $size): string
    {
        if ($size === 'large') {
            return 'logo@512x';
        } else if ($size === 'medium') {
            return 'logo@256x';
        } else {
            return 'logo@128x';
        }
    }

    /**
     * Generates the header HTML.
     *
     * @return string HTML code for <header/>.
     */
    public static function output(string $size): string
    {
        $image = self::getLogoImg($size);
        $cdn = CDN_HOST;
        $ret = <<<EOF
        <a href="/"><img alt="" id="logo" src="//{$cdn}/images/{$image}.png" loading="eager" /></a>
EOF;
        if (\Hexforged\Account::isUserLoggedIn()) {
            $user = ucwords($_SESSION['user']);
            $ret .= <<<EOF
        <div class="hex-dash__welcome">
            <p>Welcome back, <span class="hex-color__h_cyan">{$user}!</span></p>
            <p><a href="/account">manage</a> | <a href="/logout">logout</a></p>
        </div>
EOF;
        }
        return $ret;
    }
}
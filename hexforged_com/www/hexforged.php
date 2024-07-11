<?php

/**
 *
 * $KYAULabs: hexforged.php,v 1.0.0 2024/07/11 03:15:19 -0700 kyau Exp $
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

require_once("../backend/frontend.php");

class Output
{
    public static function Header()
    {
        $return = <<<EOF
        <a href="//hexforged.com"><img alt="" id="logo" src="//cdn.hexforged.com/images/logo@512x.png" loading="eager" /></a>
EOF;
        return $return;
    }

    public static function Main()
    {
        $return = <<<EOF
        <p class="login-auth"><a href="#">Login</a> <span>|</span> <a href="#">Register</a></p>
EOF;
        return $return;
    }

    public static function Footer()
    {
        $gameTime = Frontend::getGameTime();
        $version = Frontend::getVersion();
        $return = <<<EOF
        <p><a href="//discord.gg/DSvUNYm"><i class="fa-brands fa-discord"></i></a>
        <a href="//github.com/hexforged"><i class="fa-brands fa-github"></i></a></p>
        <p id="gametime">{$gameTime}</p>
        <p>v{$version}</p>
EOF;
        return $return;
    }
}

if (isset($_POST['cmd']) && trim($_POST['cmd']) != '') {
    $cmd = strtolower(trim($_POST['cmd']));
    switch ($cmd) {
        case 'header':
            echo Output::Header();
            break;
        case 'footer':
            echo Output::Footer();
            break;
        case 'main':
            echo Output::Main();
            break;
        default:
            break;
    }
} else {
    header('Location: https://hexforged.com');
}

/**
 * vim: ft=php sts=4 sw=4 ts=4 et:
 */

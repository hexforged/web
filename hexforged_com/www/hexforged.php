<?php

/**
 *
 * $KYAULabs: hexforged.php,v 1.0.3 2024/07/19 04:08:43 -0700 kyau Exp $
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
require_once(__DIR__ . '/../backend/account.php');
require_once(__DIR__ . '/../backend/metadata.php');

/**
 * Class Output
 *
 * This class handles the HTML output for the Hexforged frontend.
 */
class Output
{
    /**
     * Generates the header HTML.
     *
     * @return string HTML code for <header/>.
     */
    public static function Header(string $size = ''): string
    {
        $image = '';
        if ($size == 'large') {
            $image = 'logo@512x';
        } else if ($size == 'medium') {
            $image = 'logo@256x';
        } else {
            $image = 'logo@128x';
        }
        return <<<EOF
        <a href="//hexforged.com"><img alt="" id="logo" src="//cdn.hexforged.com/images/{$image}.png" loading="eager" /></a>
EOF;
    }

    /**
     * Generates the footer HTML.
     *
     * @return string HTML code for <footer/>.
     */
    public static function Footer(): string
    {
        $gameTime = Metadata::getGameTime();
        $version = Metadata::getVersion();
        return <<<EOF
        <p><a href="//discord.gg/DSvUNYm"><i class="fa-brands fa-discord"></i></a>
        <a href="//github.com/hexforged"><i class="fa-brands fa-github"></i></a></p>
        <p id="gametime">{$gameTime}</p>
        <p>v{$version}</p>
EOF;
    }

    /**
     * Generates the main content HTML.
     *
     * @return string HTML code for <main/>.
     */
    public static function Main(): string
    {
        return <<<EOF
        <p class="login-auth"><a href="/login">Login</a> <span>|</span> <a href="/register">Register</a></p>
        <br/><br/>
        <h5 class="hex-display__inline hex-align__center hex-color__red">Alpha Access Soon&trade;</h5>
EOF;
    }

    /**
     * Generates the registration HTML.
     *
     * @return string HTML code for <main/>.
     */
    public static function Register(): string
    {
        $googlePublic = GOOGLE_PUBLIC;
        return <<<EOF
        <br/>
        <form action="" id="account-create" method="post">
            <div class="hex-margin__top-one">
                <h4><i class="fa-solid fa-user"></i> Register</h4>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__username" autocomplete="username" name="username" type="text" />
                <label class="hex-input__label" for="hex-input__username">Account Name</label>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__email" autocomplete="email" name="email" type="text" />
                <label class="hex-input__label" for="hex-input__email">Email</label>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__passwd" autocomplete="new-password" name="passwd" type="password" />
                <label class="hex-input__label" for="hex-input__passwd">Password</label>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__passwdConfirm" autocomplete="new-password" name="passwdConfirm" type="password" />
                <label class="hex-input__label" for="hex-input__passwdConfirm">Confirm Password</label>
            </div>
            <div id="recaptcha" class="g-recaptcha" data-sitekey="{$googlePublic}" data-theme="dark"></div>
            <div class="hex-checkbox hex-margin__top-one">
                <input class="hex-checkbox__input" id="hex-checkbox__acceptTerms" name="acceptTerms" value="1" type="checkbox" />
                <label class="hex-checkbox__label" for="hex-checkbox__acceptTerms">I accept the <a href="/legal">Terms of Use and Privacy Notice</a>.</label>
            </div>
            <button type="submit" name="submit" id="submit" class="hex-btn__submit hex-margin__top-one">
                <span>Create Account</span>
            </button>
            <div class="hex-margin__top-one">
                Have an account? <a href="/login">Login instead</a>
            </div>
        </form>
EOF;
    }

    /**
     * Generates the registration HTML.
     *
     * @return string HTML code for <main/>.
     */
    public static function Login(): string
    {
        return <<<EOF
        <br/>
        <form action="" id="account-login" method="post">
            <div class="hex-margin__top-one">
                <h4><i class="fa-solid fa-key"></i> Login</h4>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__email" autocomplete="email" required name="email" type="text" />
                <label class="hex-input__label" for="hex-input__email">Email</label>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__passwd" autocomplete="current-password" required name="password" type="password" />
                <label class="hex-input__label" for="hex-input__passwd">Password</label>
            </div>
            <div class="hex-checkbox">
                <input class="hex-checkbox__input" id="hex-checkbox__remember" name="remember" value="1" type="checkbox" />
                <label class="hex-checkbox__label" for="hex-checkbox__remember">Remember me</label>
            </div>
            <button type="submit" name="submit" id="submit" class="hex-btn__submit hex-margin__top-one">
                <span>Sign in</span>
            </button>
            <div class="hex-margin__top-one">
                No account? <a href="/register">Create one</a>
            </div>
EOF;
    }

    public static function Verify(): string
    {
        return <<<EOF
        <form action="" id="account-verify" method="post">
            <div class="hex-margin__top-one">
                <h4><i class="fa-solid fa-user-check"></i> Activation</h4>
            </div>
            <input type="hidden" name="token" value="" />
            <div class="hex-margin__top-one"><span class="token"></span></div>
            <div class="hex-align__center hex-margin__top-one"><span class="loader"></span></div>
        </form>
EOF;
    }
}

if (isset($_POST['cmd']) && trim($_POST['cmd']) != '') {
    $cmd = strtolower(trim($_POST['cmd']));
    switch ($cmd) {
        case 'header':
            echo Output::Header();
            break;
        case 'header-medium':
            echo Output::Header('medium');
            break;
        case 'header-large':
            echo Output::Header('large');
            break;
        case 'footer':
            echo Output::Footer();
            break;
        case 'main':
            echo Output::Main();
            break;
        case 'register':
            echo Output::Register();
            break;
        case 'login':
            echo Output::Login();
            break;
        case 'verify':
            echo Output::Verify();
            break;
        case 'dashboard':
            //echo Output::Dashboard();
            break;
        default:
            break;
    }
} else if (isset($_POST['form']) && trim($_POST['form']) != '') {
    $form = strtolower(trim($_POST['form']));
    switch ($form) {
        case 'account-create':
            echo Account::Create($sql, $_POST);
            break;
        case 'account-login':
            echo Account::Login($sql, $_POST);
            break;
        case 'account-verify':
            echo Account::Verify($sql, $_POST['token']);
            break;
        default:
            break;
    }
} else {
    header('Location: https://hexforged.com');
}

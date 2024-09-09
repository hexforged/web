<?php

/**
 * $KYAULabs: account.php,v 1.0.1 2024/09/09 01:37:25 -0700 kyau Exp $
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

/**
 * Class Account
 *
 * This class handles the HTML output for the Hexforged frontend accounting.
 */
class Account
{
    private static $types = [
        'login' => 1,
        'manage' => 1,
        'register' => 1,
        'verify' => 1
    ];

    /**
     * Generates the user login HTML.
     *
     * @return string HTML code for <main/>.
     */
    private static function login(): string
    {
        return <<<EOF
        <br/>
        <form action="" id="account-login" method="post">
            <div class="hex-margin__top-one">
                <h4><i class="fa-solid fa-key"></i> Login</h4>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__email" autocomplete="email" name="email" type="text" />
                <label class="hex-input__label" for="hex-input__email">Email</label>
            </div>
            <div class="hex-input">
                <input class="hex-input__input" id="hex-input__passwd" autocomplete="current-password" name="passwd" type="password" />
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

    /**
     * Generates the user account management HTML.
     *
     * @return string HTML code for <main/>.
     */
    private static function manage(): string
    {
        $timestamp = new \DateTime();
        $timestamp->setTimestamp($_SESSION['lastactivity']);
        $lastActivity = date_format($timestamp, 'Y-m-d G:i:s');
        return <<<EOF
        <div class="hex-flex hex-align__left">
            <p><strong>User:</strong> <span class="hex-color__cyan">#{$_SESSION['id']} - {$_SESSION['user']}</span></p>
            <p><strong>Group ID:</strong> <span class="hex-color__cyan">{$_SESSION['gid']}</span></p>
            <p><strong>Email:</strong> <span class="hex-color__cyan">{$_SESSION['email']}</span></p>
            <p><strong>Last Login:</strong> <span class="hex-color__cyan">{$_SESSION['lastlogin']}</span></p>
            <p><strong>Last IP:</strong> <span class="hex-color__cyan">{$_SESSION['lastip']}</span></p>
            <p><strong>Last Activity:</strong> <span class="hex-color__cyan">{$lastActivity}</span></p>
        </div>
EOF;
    }

    /**
     * Generates the registration HTML.
     *
     * @return string HTML code for <main/>.
     */
    private static function register(): string
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
     * Generates the user verification HTML.
     *
     * @return string HTML code for <main/>.
     */
    private static function verify(): string
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

    /**
     * Output HTML.
     *
     * @return string HTML code for <main/>.
     */
    public static function output(string $type): ?string
    {
        if (empty($type) || !array_key_exists($type, self::$types)) return null;
        return self::$type();
    }
}
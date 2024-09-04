<?php

/**
 *
 * $KYAULabs: login.php,v 1.0.3 2024/07/26 02:01:28 -0700 kyau Exp $
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

$rus = getrusage();
require_once(__DIR__ . '/../../.env');
require_once(__DIR__ . '/../../aurora/aurora.inc.php');
require_once(__DIR__ . '/../backend/sessions.php');

$session ??= new Hexforged\Session(true);
$user = ucwords($_SESSION['user']);
Hexforged\Session::destroySession();
$hexforged = new KYAULabs\Aurora('index.html', '/cdn', true, true);
$hexforged->sessions = true;
$hexforged->title = 'Hexforged: {$user} Logout';
$hexforged->description = 'A multiplayer RPG prototype developed by KYAU Labs.';
$hexforged->dns = [CDN_HOST];
$hexforged->preload = [
    '/css/hexforged.min.css' => 'style',
    '/javascript/jquery.min.js' => 'script',
    '/fonts/Agave-Regular.ttf' => 'font',
    '/fonts/Agave-Bold.ttf' => 'font',
    '/fonts/SavaPro-Light.otf' => 'font',
    '/fonts/SavaPro-Regular.otf' => 'font',
    '/fonts/SavaPro-Medium.otf' => 'font',
    '/fonts/SavaPro-Semibold.otf' => 'font',
    '/fonts/SavaPro-Bold.otf' => 'font',
    '/fonts/SavaPro-Black.otf' => 'font',
];
$hexforged->css = [
    '../cdn/css/fontawesome.min.css' => '//' . CDN_HOST . '/css/fontawesome.min.css',
    '../cdn/css/all.min.css' => '//' . CDN_HOST . '/css/all.min.css',
    '../cdn/css/hexforged.min.css' => '//' . CDN_HOST . '/css/hexforged.min.css',
];
$hexforged->js = [
    '../cdn/javascript/jquery.min.js' => '//' . CDN_HOST . '/javascript/jquery.min.js',
    '../cdn/javascript/hexforged.min.js' => '//' . CDN_HOST . '/javascript/hexforged.min.js',
    '<external>' => '//www.google.com/recaptcha/api.js',
];
$hexforged->htmlHeader();
// <content>
echo "\t<header id=\"header-medium\"></header>\n\t<main id=\"logout\">{$user} has been logged out.</main>\n\t<footer></footer>\n";
// </content>
$hexforged->htmlFooter();
echo $hexforged->comment($rus, $_SERVER['SCRIPT_FILENAME'], true);

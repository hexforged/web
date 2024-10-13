<?php

/**
 * $KYAULabs: dashboard.php,v 1.0.3 2024/10/11 22:23:58 -0700 kyau Exp $
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
require_once(__DIR__ . '/../backend/account.php');
require_once(__DIR__ . '/../backend/sessions.php');

$session ??= new Hexforged\Session(true);
if (!Hexforged\Account::isUserLoggedIn()) {
    header('Location: /');
    exit(0);
}
$hexforged = new KYAULabs\Aurora('index.html', '/cdn', true, true);
$hexforged->sessions = true;
$user = isset($_SESSION['user']) ? ucwords($_SESSION['user']) : 'Default User';
$hexforged->title = "Hexforged: {$user}";
$hexforged->description = 'A multiplayer RPG prototype developed by KYAU Labs.';
$hexforged->dns = [CDN_HOST];
$hexforged->preload = [
    '/css/hexforged.min.css' => 'style',
    '/javascript/jquery.module.min.js' => 'script',
    '/javascript/hexforged.min.js' => 'script',
];
$hexforged->css = [
    '../cdn/css/fonts.min.css' => '//' . CDN_HOST . '/css/fonts.min.css',
    '../cdn/css/hexforged.min.css' => '//' . CDN_HOST . '/css/hexforged.min.css',
];
$hexforged->js = [
    '<external>' => 'https://cdn.socket.io/4.8.0/socket.io.min.js',
];
$hexforged->mjs = [
    '../cdn/javascript/hexforged.min.js' => '//' . CDN_HOST . '/javascript/hexforged.min.js',
    '../cdn/javascript/hexloop.min.js' => '//' . CDN_HOST . '/javascript/hexloop.min.js',
];
$hexforged->htmlHeader();
// <content>
echo "\t<header></header>\n\t<main id=\"dashboard\"><div id=\"console\"><div><h5><i class=\"fa-solid fa-rectangle-terminal fa-fw\"></i> Console</h5><div id=\"log\"></diV></div></div></main>\n\t<footer></footer>\n";
// </content>
$hexforged->htmlFooter();
echo $hexforged->comment($rus, $_SERVER['SCRIPT_FILENAME'], true);

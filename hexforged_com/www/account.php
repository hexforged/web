<?php

/**
 * $KYAULabs: account.php,v 1.0.1 2024/10/07 17:11:03 -0700 kyau Exp $
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
$hexforged->title = "Hexforged: Manage {$user}";
$hexforged->description = 'A multiplayer RPG prototype developed by KYAU Labs.';
$hexforged->dns = [CDN_HOST];
$hexforged->preload = [
    '/css/hexforged.min.css' => 'style',
    '/javascript/jquery.module.min.js' => 'script',
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
    '../cdn/css/hexforged.min.css' => '//' . CDN_HOST . '/css/hexforged.min.css',
];
$hexforged->mjs = [
    '../cdn/javascript/hexforged.min.js' => '//' . CDN_HOST . '/javascript/hexforged.min.js',
];
$hexforged->htmlHeader();
// <content>
echo "\t<header></header>\n\t<main id=\"manage\"><div id=\"console\"><div><h5><i class=\"fa-solid fa-rectangle-terminal fa-fw\"></i> Console</h5><div id=\"log\"></diV></div></div></main>\n\t<footer></footer>\n";
// </content>
$hexforged->htmlFooter();
echo $hexforged->comment($rus, $_SERVER['SCRIPT_FILENAME'], true);

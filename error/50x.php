<?php

/**
 *
 * $KYAULabs: 50x.php,v 1.0.0 2024/07/08 19:22:23 -0700 kyau Exp $
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
// 


$rus = getrusage();
require_once("../aurora/aurora.inc.php");
require_once("../hexforged_com/backend/frontend.php");

$hexforged = new KYAULabs\Aurora("index.html", "/nginx/https/hexforged_com/www", "hexforged.com", true, true);
$hexforged->title = Hexforged\Frontend::getTitle('500 Internal Server Error!');
$hexforged->description = "A multiplayer RPG prototype developed by KYAU Labs.";
$hexforged->api = ["cdn.hexforged.com"];
$hexforged->preload = [
    '/css/hexforged.min.css' => 'style',
    '/javascript/jquery-3.7.1.min.js' => 'script',
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
    '../hexforged_com/cdn/css/fontawesome.min.css' => '//cdn.hexforged.com/css/fontawesome.min.css',
    '../hexforged_com/cdn/css/brands.min.css' => '//cdn.hexforged.com/css/brands.min.css',
    '../hexforged_com/cdn/css/solid.min.css' => '//cdn.hexforged.com/css/solid.min.css',
    '../hexforged_com/cdn/css/hexforged.min.css' => '//cdn.hexforged.com/css/hexforged.min.css',
];
$hexforged->js = [
    '../hexforged_com/cdn/javascript/jquery-3.7.1.min.js' => '//cdn.hexforged.com/javascript/jquery-3.7.1.min.js',
    '../hexforged_com/cdn/javascript/hexforged.min.js' => '//cdn.hexforged.com/javascript/hexforged.min.js',
];
$hexforged->htmlHeader();
// <content>
echo "\t<main id=\"server-error\"><a href=\"/\"></a></main>\n\t<footer></footer>\n";
// </content>
$hexforged->htmlFooter();
echo $hexforged->comment($rus, $_SERVER['SCRIPT_FILENAME'], true);

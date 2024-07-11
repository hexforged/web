<?php

/**
 * $KYAULabs: frontend.php,v 1.0.1 2024/07/10 14:53:09 -0700 kyau Exp $
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

include_once(__DIR__ . '/../../aurora/sql.inc.php');
$sql ??= new \KYAULabs\SQLHandler('hexforged');

ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

date_default_timezone_set('UTC');

/**
 * Hexforged
 *
 * Hexforged is a browser based RPG that attempts to merge aspects of Action
 * RPGs and Idle RPGs with both realtime and offline gameplay modes
 * available.
 */
class Frontend
{
    const GAME_DAY = ["Moonday", "Fireday", "Earthday", "Lightday", "Iceday", "Waterday", "Cosmicday"];
    const GAME_MONTH = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    private static $phrases = [
        'Realms Unleashed'
    ];

    private static function getActualGameTime(int $gameStartTime)
    {
        $msRealDay = (24 * 60 * 60 * 1000); // milliseconds in a real day

        $gameTime = 360 * $msRealDay + (time() * 1000 - $gameStartTime * 1000) * 25;

        return [
            'year' => floor($gameTime / (360 * $msRealDay)),
            'month' => floor(($gameTime % (360 * $msRealDay)) / (30 * $msRealDay)) + 1, // +1 because months are typically 1-indexed
            'day' => floor(($gameTime % (30 * $msRealDay)) / ($msRealDay)) + 1, // +1 because days are typically 1-indexed
            'hour' => floor(($gameTime % ($msRealDay)) / (60 * 60 * 1000)),
            'minute' => floor(($gameTime % (60 * 60 * 1000)) / (60 * 1000)),
            'second' => floor(($gameTime % (60 * 1000)) / 1000),
            'weekday' => floor(($gameTime % (7 * $msRealDay)) / ($msRealDay))
        ];
    }

    public static function getGameTime()
    {
        global $sql;
        // retrieve from database, table for current league
        $data = $sql->query('SELECT UNIX_TIMESTAMP(`open`) AS `worldStart` FROM `leagues` WHERE `live` = 1')->fetchObject();
        $worldStart = intval($data->worldStart);
        $gameTime = self::getActualGameTime($worldStart);
        $gameTimeIcon = '//cdn.hexforged.com/images/elements/' . self::GAME_DAY[$gameTime['weekday']] . '@16x.png';
        return '<img id="gameTimeIcon" src="' . $gameTimeIcon . '" /> <span data-start="' . date('Y-m-d-H-i-s', $worldStart) . '">' . self::GAME_DAY[$gameTime['weekday']] . ', ' . self::GAME_MONTH[$gameTime['month']] . ' ' . $gameTime['day'] . ' ' . $gameTime['year'] . 'CE &mdash; ' . sprintf('%02d', $gameTime['hour']) . ':' . sprintf('%02d', $gameTime['minute']) . '</span>';
    }

    public static function getTitle(string $hardwire = "")
    {
        if ($hardwire !== "") {
            return 'Hexforged: ' . $hardwire;
        }
        $rand = array_rand(self::$phrases);
        return 'Hexforged: ' . self::$phrases[$rand];
    }

    public static function getVersion()
    {
        global $sql;
        // return version and hex string that updates daily
        $data = $sql->query('SELECT * FROM `version` ORDER BY `datetime` DESC');
        $version = $data->fetchObject();
        return $version->major . '.' . $version->minor . '.' . $version->patch . '<span>-' . $version->codename . '</span>';
    }

    public static function uuidv4()
    {
        $data = random_bytes(16);

        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}

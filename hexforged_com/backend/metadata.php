<?php

/**
 * $KYAULabs: metadata.php,v 1.0.3 2024/07/17 01:03:33 -0700 kyau Exp $
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

/**
 * Hexforged
 *
 * Hexforged is a browser based RPG that attempts to merge aspects of Action
 * RPGs and Idle RPGs with both realtime and offline gameplay modes
 * available.
 */
class Metadata
{
    /**
     * @var array GAME_DAY Days of the week in the game.
     * @var array GAME_MONTH Months of the year in the game.
     * @var array $phrases List of phrases used for the page title.
     */
    const GAME_DAY = ['Moonday', 'Fireday', 'Earthday', 'Lightday', 'Iceday', 'Waterday', 'Cosmicday'];
    const GAME_MONTH = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * Calculate the actual game time based on the start time.
     *
     * @param int $gameStartTime The start time of the game in Unix timestamp.
     * @return array Associative array containing year, month, day, hour, minute, second, and weekday.
     */
    private static function getActualGameTime(int $gameStartTime): array
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

    /**
     * Get the current game time as a formatted string.
     *
     * @return string The current game time in a formatted string with an icon.
     */
    public static function getGameTime(): string
    {
        global $sql;
        // retrieve from database, table for current league
        $data = $sql->query('SELECT UNIX_TIMESTAMP(`open`) AS `worldStart` FROM `leagues` WHERE `live` = 1')->fetchObject();
        $worldStart = intval($data->worldStart);
        $gameTime = self::getActualGameTime($worldStart);
        $gameTimeIcon = '//cdn.hexforged.com/images/elements/' . self::GAME_DAY[$gameTime['weekday']] . '@16x.png';
        return '<img id="gameTimeIcon" src="' . $gameTimeIcon . '" /> <span data-start="' . date('Y-m-d-H-i-s', $worldStart) . '">' . self::GAME_DAY[$gameTime['weekday']] . ', ' . self::GAME_MONTH[$gameTime['month']] . ' ' . $gameTime['day'] . ' ' . $gameTime['year'] . 'CE &mdash; ' . sprintf('%02d', $gameTime['hour']) . ':' . sprintf('%02d', $gameTime['minute']) . '</span>';
    }

    /**
     * Get the current version of the game.
     *
     * @return string The current version formatted as major.minor.patch-codename.
     */
    public static function getVersion(): string
    {
        global $sql;
        // return version and hex string that updates daily
        $data = $sql->query('SELECT * FROM `version` ORDER BY `datetime` DESC LIMIT 1');
        $version = $data->fetchObject();
        unset($data);
        $data = $sql->query('SELECT * FROM `version` WHERE `codename` IS NOT NULL ORDER BY `datetime` DESC LIMIT 1');
        $codename = $data->fetchObject()->codename;
        return "{$version->major}.{$version->minor}.{$version->patch}<span>-{$codename}</span>";
    }
}

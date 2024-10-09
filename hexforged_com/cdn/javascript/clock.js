/**
 *
 * $KYAULabs: clock.js,v 1.0.0 2024/10/07 12:44:02 -0700 kyau Exp $
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

class Clock {
  constructor(cdnHost) {
    this.gameTimeIcon = document.getElementById('gameTimeIcon');
    this.gameTimeText = document.querySelector('#gametime > span');

    /**
     * Milliseconds in a real day.
     * @constant {number}
     */
    this.msRealDay = 24 * 60 * 60 * 1000;
    /**
     * Basis date used for calculations.
     * @type {Date}
     */
    this.basisDate = new Date();
    /**
     * CDN Hostname
     * @type {string}
     */
    this.cdnHost = cdnHost;
    /**
     * Stores the last date and time string.
     * @type {string}
     */
    this.lastDateTime = "";
    /**
     * Stores the last icon URL.
     * @type {string}
     */
    this.lastIcon = this.gameTimeIcon.src;
  }

  startClock() {
    // set the game's starting datetime
    let dataTime = this.gameTimeText.dataset.start;
    let gTime = dataTime.split("-");
    gTime = gTime.map((x) => parseInt(x));
    // basis date is used to convert real time to game time
    this.basisDate.setUTCFullYear(gTime[0], gTime[1] - 1, gTime[2]);
    this.basisDate.setUTCHours(gTime[3], gTime[4], gTime[5], 0);

    // start loop
    setInterval(() => this.updateGameTime(), 250);
  }

  /**
   * Updates the game time based on the real time.
   */
  updateGameTime() {
    let now = new Date();

    let gameDate = 360 * this.msRealDay + (now.getTime() - this.basisDate.getTime()) * 25;

    let vYear = Math.floor(gameDate / (360 * this.msRealDay));
    let vMon = Math.floor((gameDate % (360 * this.msRealDay)) / (30 * this.msRealDay)) + 1;
    let vDate = Math.floor((gameDate % (30 * this.msRealDay)) / this.msRealDay) + 1;
    let vHour = Math.floor((gameDate % this.msRealDay) / (60 * 60 * 1000));
    let vMin = Math.floor((gameDate % (60 * 60 * 1000)) / (60 * 1000));
    let vSec = Math.floor((gameDate % (60 * 1000)) / 1000);
    let vDay = Math.floor((gameDate % (7 * this.msRealDay)) / this.msRealDay);

    let vHourP = String(vHour).padStart(2, "0");
    let vMinP = String(vMin).padStart(2, "0");

    let newDateTime = `${Clock.GAME_DAY[vDay]}, ${Clock.GAME_MONTH[vMon]} ${vDate} ${vYear}CE &mdash; ${vHourP}:${vMinP}`;
    let newIcon = "//" + this.cdnHost + "/images/elements/" + Clock.GAME_DAY[vDay] + "@16x.png";

    if (this.lastDateTime != newDateTime) {
      if (this.lastIcon != newIcon) {
        //$("#gametime > #gameTimeIcon").attr("src", newIcon);
        this.gameTimeIcon.src = newIcon;
        this.lastIcon = newIcon;
      }
      //$("#gametime > span").html(newDateTime);
      this.gameTimeText.innerHTML = newDateTime;
      this.lastDateTime = newDateTime;
    }
  }
}
/**
 * Array of game day names.
 * @constant {string[]}
 */
Clock.GAME_DAY = new Array(
  "Moonday",
  "Fireday",
  "Earthday",
  "Lightday",
  "Iceday",
  "Waterday",
  "Cosmicday"
);
/**
 * Array of game month abbreviations.
 * @constant {string[]}
 */
Clock.GAME_MONTH = new Array(
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
);

export { Clock };
export default Clock;
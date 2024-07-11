/**
 *
 * $KYAULabs: hexforged.js,v 1.0.0 2024/07/08 19:23:54 -0700 kyau Exp $
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

const DELAY = 250;
const GAME_DAY = new Array(
  "Moonday",
  "Fireday",
  "Earthday",
  "Lightday",
  "Iceday",
  "Waterday",
  "Cosmicday"
);
const GAME_MONTH = new Array(
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
const msRealDay = 24 * 60 * 60 * 1000; // milliseconds in a real day

let basisDate = new Date();
let lastDateTime = "";
let lastIcon = "";

/*
 * Console Log
 */
function log(message, section, color) {
  if (!color) {
    color = "inherit";
  } else {
    color = "color: " + color + ";";
  }
  console.log("%cHexforged <" + section + "> " + message, color);
}

/*
 * AJAX
 */
function getData(url, keyword) {
  let req = $.ajax({
    url: "/" + url + ".php",
    method: "POST",
    data: { cmd: keyword },
    dataType: "html",
    beforeSend: function (xhr) {
      log("Requesting: " + keyword, "DATA");
    },
  });
  req.fail(function (xhr, textStatus, errorThrown) {
    if (!errorThrown) {
      log("Unknown", "ERROR");
    } else {
      log(textStatus + " - " + errorThrown, "ERROR", "darkred");
    }
  });
  req.done(function (data, textStatus, xhr) {
    if (data.length > 0) {
      log("Response Received: " + keyword + " (" + data.length + ")", "DATA");
      processData(keyword, data);
    } else {
      log(
        "Empty/Null response received from " + keyword + ".",
        "WARNING",
        "#9aa0a6"
      );
    }
  });
}

function processData(keyword, data) {
  setTimeout(function () {
    log("Processing: " + keyword + " (" + data.length + ")", "DATA", "green");
    if (keyword === "main") {
      $("main").html(data);
    } else if (keyword === "footer") {
      $("footer").append(data);
      // basis date is used to convert real time to game time
      let dataTime = $("#gametime > span").data("start");
      let gTime = dataTime.split("-");
      gTime = gTime.map((x) => parseInt(x));
      basisDate.setUTCFullYear(gTime[0], gTime[1] - 1, gTime[2]);
      basisDate.setUTCHours(gTime[3], gTime[4], gTime[5], 0);
      // set current dayIcon
      lastIcon = $("footer img#gameTimeIcon").src;
      // begin gametime loop
      setInterval(() => getGameTime(), 250);
    } else if (keyword === "header") {
      $("header").html(data);
    }
  }, DELAY);
}

/*
 * Live Game Clock
 */
function getGameTime() {
  let now = new Date();

  let gameDate = 360 * msRealDay + (now.getTime() - basisDate.getTime()) * 25;

  let vYear = Math.floor(gameDate / (360 * msRealDay));
  let vMon = Math.floor((gameDate % (360 * msRealDay)) / (30 * msRealDay)) + 1;
  let vDate = Math.floor((gameDate % (30 * msRealDay)) / msRealDay) + 1;
  let vHour = Math.floor((gameDate % msRealDay) / (60 * 60 * 1000));
  let vMin = Math.floor((gameDate % (60 * 60 * 1000)) / (60 * 1000));
  let vSec = Math.floor((gameDate % (60 * 1000)) / 1000);
  let vDay = Math.floor((gameDate % (7 * msRealDay)) / msRealDay);

  let vHourP = String(vHour).padStart(2, "0");
  let vMinP = String(vMin).padStart(2, "0");

  newDateTime = `${GAME_DAY[vDay]}, ${GAME_MONTH[vMon]} ${vDate} ${vYear}CE &mdash; ${vHourP}:${vMinP}`;
  newIcon =
    "//cdn.hexforged.com/images/elements/" + GAME_DAY[vDay] + "@16x.png";

  if (lastDateTime != newDateTime) {
    if (lastIcon != newIcon) {
      $("#gametime > #gameTimeIcon").attr("src", newIcon);
      lastIcon = newIcon;
    }
    $("#gametime > span").html(newDateTime);
    lastDateTime = newDateTime;
  }
}

/*
 * DOM Ready: $(document).ready
 */

$(function () {
  let manager = "hexforged";
  if (
    !$("main").is("#not-found") &&
    !$("main").is("#restricted") &&
    !$("main").is("#server-error")
  ) {
    getData(manager, "header");
    getData(manager, "main");
  }
  getData(manager, "footer");
});

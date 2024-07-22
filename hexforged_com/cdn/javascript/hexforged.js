/**
 *
 * $KYAULabs: hexforged.js,v 1.0.4 2024/07/19 04:07:52 -0700 kyau Exp $
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

/**
 * Delay constant in milliseconds.
 * @constant {number}
 */
const DELAY = 50;

/**
 * Array of game day names.
 * @constant {string[]}
 */
const GAME_DAY = new Array(
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

/**
 * Milliseconds in a real day.
 * @constant {number}
 */
const msRealDay = 24 * 60 * 60 * 1000;

/**
 * Basis date used for calculations.
 * @type {Date}
 */
let basisDate = new Date();

/**
 * Stores the last date and time string.
 * @type {string}
 */
let lastDateTime = "";

/**
 * Stores the last icon URL.
 * @type {string}
 */
let lastIcon = "";

/**
 * Stores the last submit button.
 * @type {string}
 */
let lastSubmit = "";

/**
 * Recaptcha instance.
 * @type {Object|null}
 */
let recaptcha = null;

/**
 * Logs a message to the console with a specific section and color.
 *
 * @param {string} message - The message to log.
 * @param {string} section - The section name.
 * @param {string} [color] - The color of the message.
 */
function log(message, section, color) {
  if (!color) {
    color = "inherit";
  } else {
    color = "color: " + color + ";";
  }
  console.log("%cHexforged <" + section + "> " + message, color);
}

/**
 * Sends an AJAX request to get data from the server.
 *
 * @param {string} url - The URL to send the request to.
 * @param {string} keyword - The command to send with the request.
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

/**
 * Sends form data to a specified URL via an AJAX POST request.
 * Logs the process and handles the response.
 *
 * @param {string} url - The URL endpoint to which the form data should be sent (without the .php extension).
 * @param {Object} form - The jQuery form object to be serialized and sent.
 */
function getFormData(url, form) {
  let id = form.attr("id");
  let data = form.serialize();
  let addData = { form: id };
  data += "&" + $.param(addData);
  let req = $.ajax({
    url: "/" + url + ".php",
    type: "POST",
    data: data,
    beforeSend: function (xhr) {
      log("Submitting: <form#" + id + "/>", "DATA");
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
      log(
        "Response Received: <form#" + id + "/> (" + data.length + ")",
        "DATA"
      );
      processFormData(id, data);
    } else {
      log(
        "Empty/Null response received from <form#" + id + "/>.",
        "WARNING",
        "#9aa0a6"
      );
    }
  });
}

/**
 * Processes the received data based on the keyword.
 *
 * @param {string} keyword - The command associated with the data.
 * @param {string} data - The received data.
 */
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
    } else if (keyword.substr(0, 6) === "header") {
      $("header").html(data);
    } else if (keyword === "verify") {
      $("#" + keyword).html(data);
      $("#account-verify > input[type=hidden]").val($("#verify").data("token"));
      $("#account-verify > div > span.token").html($("#verify").data("token"));
      setTimeout(() => $("#account-verify").submit(), 500);
    } else {
      $("#" + keyword).html(data);
      // render recaptcha if found
      if ($("#recaptcha").length) {
        if (typeof grecaptcha !== "undefined") {
          recaptcha = grecaptcha.render("recaptcha", {
            sitekey: $("#recaptcha").data("sitekey"),
          });
        }
      }
    }
  }, DELAY);
}

function processFormData(id, data) {
  log("Processing: <form#" + id + "/> (" + data.length + ")", "FORM", "green");
  if ($("#recaptcha").length) {
    let response = grecaptcha.getResponse();
    if (response.length === 0) {
      $("#recaptcha").after(
        '<span class="hex-form__fail hex-color__red">Complete the recaptcha challenge.</span>'
      );
    }
  }
  //$("main").append(data);
  let sections = data.split("=");
  if (id === "account-create") {
    if (sections[0] === "fail") {
      // account-create: fail
      if (sections[1].length > 0) {
        let fail = sections[1].split(":");
        fail_loop: for (let i = 0; i < fail.length; i++) {
          switch (fail[i]) {
            case "account-add":
              $("form > .hex-margin__top-one:nth-child(1)").after(
                '<span class="hex-form__fail hex-color__red">Failed to create account!</span>'
              );
              break fail_loop;
            case "email-check":
              $("form > .hex-margin__top-one:nth-child(1)").after(
                '<span class="hex-form__fail hex-color__red">Email address already in use!</span>'
              );
              break fail_loop;
            case "username-check":
              $("form > .hex-margin__top-one:nth-child(1)").after(
                '<span class="hex-form__fail hex-color__red">Account name already in use!</span>'
              );
              break fail_loop;
            case "empty-username":
              $("#hex-input__username")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Account name is required.</span>'
                );
              break;
            case "empty-email":
              $("#hex-input__email")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Email address is required.</span>'
                );
              break;
            case "empty-passwd":
              $("#hex-input__passwd")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Password is required.</span>'
                );
              break;
            case "empty-passwdConfirm":
              $("#hex-input__passwdConfirm")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Password is required.</span>'
                );
              break;
            case "username-validate":
              $("#hex-input__username")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Name can only contain letters and whitespace.</span>'
                );
              break;
            case "email-validate":
              $("#hex-input__email")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Email address is invalid.</span>'
                );
              break;
            case "passwd-validate":
              $("#hex-input__passwd")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Password must be 8-32 characters and contain one uppercase, lowercase, number and special character.</span>'
                );
              break;
            case "passwd-match":
              $("#hex-input__passwdConfirm")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Passwords do not match.</span>'
                );
              break;
            case "accept-terms":
              $("#hex-checkbox__acceptTerms")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">You must accept the Terms of Service.</span>'
                );
            default:
              break;
          }
        }
        $("#submit > span").html(lastSubmit);
        log(
          "Failed: <form#" + id + "/> (" + data.length + ")",
          "ERROR",
          "darkred"
        );
      }
    } else if (sections[0] === "success") {
      // account-create: success
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__success hex-color__green">Activation email has been sent!</span>'
      );
      $("#recaptcha").html("");
      $("#submit > span").html(
        '<i class="fa-solid fa-check hex-color__green"></i>'
      );
      log("Success: <form#" + id + "/> (" + data.length + ")", "FORM", "green");
    } else {
      // account-create: fail
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__fail hex-color__red">Failed to create account!</span>'
      );
      $("#submit > span").html(lastSubmit);
      log(
        "Failed: <form#" + id + "/> (" + data.length + ")",
        "ERROR",
        "darkred"
      );
    }
  } else if (id === "account-verify") {
    //$("main").append(data);
    if (sections[0] === "fail") {
      // account-verify: fail
      if (sections[1].length > 0) {
        let fail = sections[1].split(":");
        fail_loop: for (let i = 0; i < fail.length; i++) {
          switch (fail[i]) {
            case "activated-check":
              $("form > .hex-margin__top-one:nth-child(1)").after(
                '<span class="hex-form__fail hex-color__red">Account is already active!</span>'
              );
              break fail_loop;
            case "token-check":
              $("form > .hex-margin__top-one:nth-child(1)").after(
                '<span class="hex-form__fail hex-color__red">Token is invalid!</span>'
              );
              break fail_loop;
            default:
              break;
          }
        }
        $("#account-verify > div > span.loader").remove();
        log(
          "Failed: <form#" + id + "/> (" + data.length + ")",
          "ERROR",
          "darkred"
        );
      }
    } else if (sections[0] === "success") {
      // account-verify: success
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__success hex-color__green">Account \'' +
          sections[1] +
          "' has been activated!</span>"
      );
      icon = $("#account-verify > div > span.loader").parent();
      $("#account-verify").attr("id", "redirect");
      $(icon).html(
        '<button type="submit" name="submit" id="submit" class="hex-btn__submit hex-margin__top-one" data-url="/login"><span>Sign in</span></button>'
      );
      log("Success: <form#" + id + "/> (" + data.length + ")", "FORM", "green");
    } else {
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__fail hex-color__red">Token is invalid!</span>'
      );
      $("#account-verify > div > span.loader").remove();
      log(
        "Failed: <form#" + id + "/> (" + data.length + ")",
        "ERROR",
        "darkred"
      );
    }
  } else {
    log("Failed: <form#" + id + "/> (" + data.length + ")", "ERROR", "darkred");
  }
}

/**
 * Updates the game time based on the real time.
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

/**
 * Initializes the document ready functions.
 */
$(function () {
  let manager = "hexforged";
  if (
    !$("main").is("#not-found") &&
    !$("main").is("#restricted") &&
    !$("main").is("#server-error")
  ) {
    if (
      $("main").is("#register") ||
      $("main").is("#login") ||
      $("main").is("#verify") ||
      $("main").is("#dashboard")
    ) {
      if ($("main").is("#dashboard")) {
        getData(manager, "header");
      } else {
        getData(manager, "header-medium");
      }
      getData(manager, $("main").attr("id"));
    } else {
      getData(manager, "header-large");
      getData(manager, "main");
    }
  }
  getData(manager, "footer");

  // form submission
  $(document).on("submit", "form", function (event) {
    event.preventDefault();
    lastSubmit = $("#submit > span").html();
    $("#submit > span").html('<div class="loader"></div>');
    $(".hex-form__fail").remove();
    if ($("form").attr("id") === "redirect") {
      location.href =
        "https://" + document.location.hostname + $("#submit").data("url");
    } else {
      getFormData(manager, $(this));
    }
  });

  // responsive input labels
  $(document).on("input", "input.hex-input__input", function (event) {
    if (this.value) {
      $(this).addClass("hex-input--has-value");
    } else {
      $(this).removeClass("hex-input--has-value");
    }
  });
  $(document).on("click", "label.hex-input__label", function (event) {
    $(this).prev().focus();
  });

  // checkbox custom check using font awesome
  $(document).on("click", "input.hex-checkbox__input", function (event) {
    if ($(".hex-checkbox__override-icon").length) {
      $(".hex-checkbox__override-icon").remove();
      $(this).prop("checked", false);
    } else {
      $(this).after(
        '<i class="fa-solid fa-check hex-color__green hex-checkbox__override-icon"></i>'
      );
      $(this).prop("checked", true);
    }
  });
});

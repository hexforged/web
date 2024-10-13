/**
 *
 * $KYAULabs: hexforged.js,v 1.0.9 2024/10/11 22:22:04 -0700 kyau Exp $
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

import { $, jQuery } from './jquery.module.min.js';
import { Ajax } from './ajax.min.mjs';

const ajax = new Ajax('hexforged');

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
      $("main").is("#logout") ||
      $("main").is("#manage") ||
      $("main").is("#verify") ||
      $("main").is("#dashboard")
    ) {
      if ($("main").is("#dashboard") || $("main").is("#manage")) {
        ajax.post('header');
      } else {
        ajax.post('header-medium');
      }
      ajax.post($("main").attr("id"));
    } else {
      ajax.post('header-large');
      ajax.post('main');
    }
  }
  ajax.post('footer');

  // toggle console
  $(document).on('keyup', function (event) {
    if (event.which == 192) {
      if ($('#console').is(":visible")) {
        $('#console').toggleClass('shown');
        setTimeout(function () {
          $('#console').toggle();
        }, 525);
      } else {
        $('#console').toggle();
        setTimeout(function () {
          $('#console').toggleClass('shown');
        }, 50);
      }
    }
  });

  // form submission
  $(document).on("submit", "form", function (event) {
    event.preventDefault();
    Ajax.lastSubmit = $("#submit > span").html();
    $("#submit > span").html('<div class="loader"></div>');
    $(".hex-form__fail").remove();
    if ($("form").attr("id") === "redirect") {
      location.href =
        "https://" + document.location.hostname + $("#submit").data("url");
    } else {
      ajax.postForm($('form'));
    }
  });

  // enter the realm
  $(document).on("click", "#enter-the-realm", function (event) {
    $("#enter-the-realm > span").html('<div class="loader"></div>');
    setTimeout(function () {
      location.href = "https://" + document.location.hostname + "/dashboard/";
    }, 150);
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

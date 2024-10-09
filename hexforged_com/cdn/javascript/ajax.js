/**
 *
 * $KYAULabs: ajax.js,v 1.0.0 2024/10/07 20:58:06 -0700 kyau Exp $
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

import { $ } from './jquery.module.min.js';
import { Log } from './logger.js';
import { Clock } from './clock.js';

class Ajax {
  constructor(url) {
    this.url = url;
    this.delay = 50;
    Ajax.lastSubmit = '';
  }

  static accountCreate(id, sections, dataLength) {
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
        $("#submit > span").html(Ajax.lastSubmit);
        Log.error(`Failed: form#${id} (${dataLength})`);
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
      Log.success(`Success: form#${id} (${dataLength})`);
    } else {
      // account-create: fail
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__fail hex-color__red">Failed to create account!</span>'
      );
      $("#submit > span").html(Ajax.lastSubmit);
      Log.error(`Failed: form#${id} (${dataLength})`);
    }
  }

  static accountLogin(id, sections, dataLength) {
    if (sections[0] === "fail") {
      // account-login: fail
      if (sections[1].length > 0) {
        let fail = sections[1].split(":");
        fail_loop: for (let i = 0; i < fail.length; i++) {
          switch (fail[i]) {
            case "email-check":
              $("#hex-input__email")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Email address is invalid.</span>'
                );
              break fail_loop;
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
            case "passwd-check":
              $("#hex-input__passwd")
                .parent()
                .after(
                  '<span class="hex-form__fail hex-color__red">Password is invalid.</span>'
                );
              break;
            default:
              break;
          }
        }
      }
      Log.error(`Failed: form#${id} (${dataLength})`);
      $("#submit > span").html(Ajax.lastSubmit);
    } else if (sections[0] === "success") {
      // account-login: success
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__success hex-color__green">Login successful!</span>'
      );
      Log.success(`Success: form#${id} (${dataLength})`);
      setTimeout(function () {
        location.href = "https://" + document.location.hostname + "/dashboard/";
      }, 150);
      return true;
    } else {
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__fail hex-color__red">Login failed!</span>'
      );
      Log.error(`Failed: form#${id} (${dataLength})`);
      $("#submit > span").html(Ajax.lastSubmit);
    }
    return false;
  }

  static accountVerify(id, sections, dataLength) {
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
        Log.error(`Failed: form#${id} (${dataLength})`);
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
      Log.success(`Success: form#${id} (${dataLength})`);
      return true;
    } else {
      $("form > .hex-margin__top-one:nth-child(1)").after(
        '<span class="hex-form__fail hex-color__red">Token is invalid!</span>'
      );
      $("#account-verify > div > span.loader").remove();
      Log.error(`Failed: form#${id} (${dataLength})`);
    }
    return false;
  }

  static processData(keyword, data) {
    setTimeout(function () {
      Log.success(`Processing: ${keyword} (${data.length})`);
      if (keyword === "main") {
        $("main").append(data);
      } else if (keyword === "footer") {
        $("footer").append(data);
        // begin clock loop
        setTimeout(function () {
          let url = new URL(import.meta.url);
          let clock = new Clock(url.hostname);
          clock.startClock();
        }, this.delay);
      } else if (keyword.substr(0, 6) === "header") {
        $("header").html(data);
      } else if (keyword === "verify") {
        $("#" + keyword).html(data);
        $("#account-verify > input[type=hidden]").val($("#verify").data("token"));
        $("#account-verify > div > span.token").html($("#verify").data("token"));
        setTimeout(() => $("#account-verify").submit(), 500);
      } else {
        $("#" + keyword).append(data);
        // render recaptcha if found
        if ($("#recaptcha").length) {
          if (typeof grecaptcha !== "undefined") {
            recaptcha = grecaptcha.render("recaptcha", {
              sitekey: $("#recaptcha").data("sitekey"),
            });
          }
        }
      }
    }, this.delay);
  }

  static processFormData(id, data) {
    let dataLength = data.length;
    Log.info(`Processing: form#${id} (${dataLength})`);
    if ($("#recaptcha").length) {
      let response = grecaptcha.getResponse();
      if (response.length === 0) {
        $("#recaptcha").after(
          '<span class="hex-form__fail hex-color__red">Complete the recaptcha challenge.</span>'
        );
      }
    }
    let sections = data.split("=");
    if (id === "account-create") {
      Ajax.accountCreate(id, sections, dataLength);
    } else if (id === "account-verify") {
      Ajax.accountVerify(id, sections, dataLength);
    } else if (id === "account-login") {
      Ajax.accountLogin(id, sections, dataLength);
    } else {
      Log.error(`Failed: form#${id} (${dataLength})`);
    }
  }

  request(method = 'POST', packet = null, form = false, formId = 0) {
    if (!form) packet = { cmd: packet };
    return $.ajax({
      url: '/' + this.url + '.php',
      type: ['GET', 'POST', 'PUT'].includes(method) ? method : 'POST',
      data: packet,
      dataType: 'html',
      error: function (jqXHR, textStatus, errorThrown) {
        if (!errorThrown) {
          Log.error('Unknown');
        } else {
          Log.error(`${textStatus} - ${errorThrown}`);
        }
      },
    });
  }

  get(keyword = null) {
    Log.info(`Requesting: ${keyword}`);
    let req = this.request('GET', keyword);
    req.done(function (data, textStatus, xhr) {
      if (data.length > 0) {
        Log.info(`Response Received: ${keyword} (${data.length})`);
        Ajax.processData(keyword, data);
      } else {
        Log.warn(`Empty/Null response received.`);
      }
    });
  }

  post(keyword) {
    Log.info(`Requesting: ${keyword}`);
    let req = this.request('POST', keyword);
    req.done(function (data, textStatus, xhr) {
      if (data.length > 0) {
        Log.info(`Response Received: ${keyword} (${data.length})`);
        Ajax.processData(keyword, data);
      } else {
        Log.warn(`Empty/Null response received.`);
      }
    });
  }

  postForm(form) {
    console.log(form);
    let formId = form.attr("id");
    console.log(formId);
    let formData = form.serialize();
    formData += "&" + $.param({ form: formId });
  
    Log.info(`Submitting: form#${formId}`);
    let req = this.request('POST', formData, true, formId);
    req.done(function (data, textStatus, xhr) {
      if (data.length > 0) {
        Log.info(`Response Received: form#${formId} (${data.length})`);
        Ajax.processFormData(formId, data);
      } else {
        Log.warn(`Empty/Null response received.`);
      }
    });
  }

  put(keyword) {
    Log.info(`Requesting: ${keyword}`);
    let req = this.request('PUT', keyword);
    req.done(function (data, textStatus, xhr) {
      if (data.length > 0) {
        Log.info(`Response Received: ${keyword} (${data.length})`);
        Ajax.processData(keyword, data);
      } else {
        Log.warn(`Empty/Null response received.`);
      }
    });
  }
}

export { Ajax };
export default Ajax;
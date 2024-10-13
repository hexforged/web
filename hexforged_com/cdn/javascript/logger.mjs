/**
 *
 * $KYAULabs: logger.mjs,v 1.0.0 2024/10/07 22:45:55 -0700 kyau Exp $
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

import { Color } from './color.min.mjs';

/**
 * Class representing the console logger.
 */
class Log {
  /**
   * Creates a logging instance for handling log messages with different styles.
   */
  static console = document.getElementById("log");
  
  /**
   * Scrolls the <div> element to the bottom.
   */
  static scroll() {
    Log.console.lastChild.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Logs an informational message.
   * @param {string} text - The message to log.
   */
  static info(text) {
    Log.console.insertAdjacentHTML(
      "beforeend",
      `<span style="color:${Color.logger.default.string}"><i class="fa-duotone fa-solid fa-square-info"></i> ${text}</span>`
    );
    Log.scroll();
  }

  static warn(text) {
    Log.console.insertAdjacentHTML(
      'beforeend',
      `<span style="color:${Color.logger.default.string}"><i class="fa-duotone fa-solid fa-square-question"></i> ${text}</span>`
    );
    Log.scroll();
  }

  /**
   * Logs an error message.
   * @param {string} text - The error message to log.
   */
  static error(text) {
    Log.console.insertAdjacentHTML(
      "beforeend",
      `<span style="color:${Color.logger.error.string}"><i class="fa-duotone fa-solid fa-square-xmark"></i> ${text}</span>`
    );
    Log.scroll();
  }

  /**
   * Logs a success message.
   * @param {string} text - The success message to log.
   */
  static success(text) {
    Log.console.insertAdjacentHTML(
      "beforeend",
      `<span style="color:${Color.logger.success.string}"><i class="fa-duotone fa-solid fa-square-check"></i> ${text}</span>`
    );
    Log.scroll();
  }

  /**
   * Logs a custom message.
   * @param {string} color - The color of the message to log.
   * @param {string} text - The custom message to log.
   */
  static custom(color, text) {
    Log.console.insertAdjacentHTML(
      "beforeend",
      `<span style="color:${color}"><i class="fa-solid fa-square"></i> ${text}</span>`
    );
    Log.scroll();
  }
}

export { Log };
export default Log;
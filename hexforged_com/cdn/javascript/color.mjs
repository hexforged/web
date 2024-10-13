/**
 *
 * $KYAULabs: color.mjs,v 1.0.0 2024/10/07 22:50:43 -0700 kyau Exp $
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
 * Class representing a 32-bit RGBA color.
 */
class Color {
  /**
   * Creates an instance of Color.
   * @param {binary} color - The rgba color value.
   */
  constructor(color) {
    if (!this.valid_color(color)) {
      throw new Error(`Invalid hexadecimal color: ${color}`);
    }
    this._color = color;
    this._r = color >>> 24;
    this._g = (color >>> 16) & 0xff;
    this._b = (color >>> 8) & 0xff;
    this._a = color & 0xff;
    this._bt601g = (this._r * 0.299 + this._g * 0.587 + this._b * 0.114) >> 0;
    this._bt709g = (this._r * 0.2126 + this._g * 0.7152 + this._b * 0.0722) >> 0;
    this._yiq = (this._r * 299 + this._g * 587 + this._b * 114) / 1000;
  }
  get r() {
    return parseInt(this._r, 10);
  }
  get g() {
    return parseInt(this._g, 10);
  }
  get b() {
    return parseInt(this._b, 10);
  }
  get a() {
    return parseFloat(this._a / 255);
  }
  get bt601() {
    return `#${((this._bt601g << 16) | (this._bt601g << 8) | this._bt601g | this._a ).toString(16).padStart(8, "0")}`;
  }
  get bt709() {
    return `#${((this._bt709g << 16) | (this._bt709g << 8) | this._bt709g | this._a).toString(16).padStart(8, "0")}`;
  }
  get hsl() {
    let r = this.r / 255, g = this.g / 255, b = this.b / 255;
    const vmax = Math.max(r, g, b), vmin = Math.min(r, g, b);
    let hue, saturation, lightness = (vmax + vmin) / 2;
    if (vmax === vmin) {
      return [0, 0, lightness]; // achromatic
    }

    const chroma = vmax - vmin;
    saturation = lightness > 0.5 ? chroma / (2 - vmax - vmin) : chroma / (vmax + vmin);
    if (vmax === r) hue = (g - b) / chroma + (g < b ? 6 : 0);
    if (vmax === g) hue = (b - r) / chroma + 2;
    if (vmax === b) hue = (r - g) / chroma + 4;
    hue /= 6;

    return [
      Math.round(hue * 360),
      Math.round(saturation * 100),
      Math.round(lightness * 100 * 10) / 10
    ];
  }
  get inverse() {
    return `#${(color ^ 0xffffffff).toString(16).padStart(8, "0")}`;
  }
  get string() {
    return `#${this._color.toString(16).padStart(8, "0")}`;
  }
  get text_color() {
    const c = this._yiq >= 128 ? 0x0 : 0xffffff;
    return `#${c.toString(16).padStart(8, "0")}`;
  }
  static hsl_to_rgb(h, s, l) {
    (h /= 360), (s /= 100), (l /= 100);
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = Color.hue_to_rgb(p, q, h + 1 / 3);
      g = Color.hue_to_rgb(p, q, h);
      b = Color.hue_to_rgb(p, q, h - 1 / 3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }
  static hue_to_rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  static to_hex(num) {
    return ("00" + num.toString(16)).substr(-2);
  }
  static rgba_to_hex(_r, _g, _b, _a = 255) {
    const r = Color.to_hex(_r),
      g = Color.to_hex(_g),
      b = Color.to_hex(_b),
      a = Color.to_hex(_a);
    const color = parseInt(`${r}${g}${b}${a}`, 16);
    return new Color(color);
  }
  valid_color(value) {
    return (
      typeof value === "number" && value >= 0x00000000 && value <= 0xffffffff
    );
  }
  variants(steps = 5, decrement = 4) {
    const hsl = this.hsl;
    const [hue, saturation, lightness] = hsl;
    // Log.custom("dimgray", `h:${hue}&deg; s:${saturation}% l:${lightness}%`);

    let variants = [];
    for (let i = 0; i <= steps; i++) {
      let new_lightness = Math.max(0, lightness - decrement * i);
      const rgb_variant = Color.hsl_to_rgb(hue, saturation, new_lightness);
      variants.push(rgb_variant);
    }

    return variants;
  }
}
Color.biomes = {
  dirt: {color: new Color(0xe6c87fff), opacity: 0.25},
  grass: {color: new Color(0x467a35ff), opacity: 0.25},
  water: {color: new Color(0x00b6ceff), opacity: 0.25}
};
Color.coords = {
  origin: {color: new Color(0xe6e600ff), opacity: 0.75},
  q: {color: new Color(0x009600ff), opacity: 0.25},
  r: {color: new Color(0x009696ff), opacity: 0.25},
  s: {color: new Color(0x960096ff), opacity: 0.25},
  highlight: {color: new Color(0xc8c8c8ff), opacity: 0.8},
  highlight_ring: {color: new Color(0xc8c8c8ff), opacity: 0.35},
  text: {color: new Color(0x969696ff), opacity: 1},
  def: {color: new Color(0x323232ff), opacity: 1}
}
Color.logger = {
  default: new Color(0x969696ff),
  error: new Color(0x960000ff),
  success: new Color(0x009600ff)
};

/**
 * https://medium.com/swlh/javascript-color-functions-c91efabdc155
 * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */

export { Color };
export default Color;
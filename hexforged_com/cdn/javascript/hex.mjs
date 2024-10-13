/**
 *
 * $KYAULabs: hex.mjs,v 1.0.0 2024/10/09 13:37:59 -0700 kyau Exp $
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

import { OffsetCoord } from './offsetcoord.min.mjs';
import { Pathfinding } from './pathfinding.min.mjs';

/**
 * Class representing a cube coordinate in a hex grid.
 */
class Hex {
  /**
   * Creates an instance of Hex.
   * @param {number} q - The q coordinate in cube space.
   * @param {number} r - The r coordinate in cube space.
   * @param {number} s - The s coordinate in cube space.
   */
  constructor(q, r, s) {
    this.q = q;
    this.r = r;
    this.s = s;
  }
  add(b) {
    return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
  }
  subtract(b) {
    return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
  }
  scale(factor) {
    return new Hex(this.q * factor, this.r * factor, this.s * factor);
  }
  rotate_left() {
    return new Hex(-this.s, -this.q, -this.r);
  }
  rotate_right() {
    return new Hex(-this.r, -this.s, -this.q);
  }
  static direction(direction) {
    return Hex.directions[direction];
  }
  neighbor(direction) {
    return this.add(Hex.direction(direction));
  }
  diagonal_neighbor(direction) {
    return this.add(Hex.diagonals[direction]);
  }
  len() {
    return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
  }
  distance(b) {
    return this.subtract(b).len();
  }
  compare(b) {
  if (this.q == b.q && this.r == b.r && this.s == b.s) {
    return true;
  }
    return false;
  }
  to_evenr() {
    const col = this.q + (this.r + (this.r & 1)) / 2;
    const row = this.r;
    return new OffsetCoord(col, row);
  }
  on_grid(width) {
    if (this.q !== this.q) return false;
    if (Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s)) > width) {
      return false;
    }
    return true;
  }
  round() {
    let qi = Math.round(this.q);
    let ri = Math.round(this.r);
    let si = Math.round(this.s);
    const q_diff = Math.abs(qi - this.q);
    const r_diff = Math.abs(ri - this.r);
    const s_diff = Math.abs(si - this.s);
    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si;
    } else if (r_diff > s_diff) {
      ri = -qi - si;
    } else {
      si = -qi - ri;
    }
    return new Hex(qi, ri, si);
  }
  lerp(b, t) {
    return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
  }
  linedraw(b) {
    return Pathfinding.linedraw(this, b)
  }
}
Hex.directions = [new Hex(1, 0, -1), new Hex(1, -1, 0), new Hex(0, -1, 1), new Hex(-1, 0, 1), new Hex(-1, 1, 0), new Hex(0, 1, -1)];
Hex.diagonals = [new Hex(2, -1, -1), new Hex(1, -2, 1), new Hex(-1, -1, 2), new Hex(-2, 1, 1), new Hex(-1, 2, -1), new Hex(1, 1, -2)];

export { Hex };
export default Hex;
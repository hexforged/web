/**
 *
 * $KYAULabs: tile.mjs,v 1.0.0 2024/10/09 13:53:26 -0700 kyau Exp $
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

import { Hex } from './hex.min.mjs';
import { Point } from './point.min.mjs';

/**
 * Class representing a hexagonal tile.
 */
class Tile {
  /**
   * Creates an instance of Tile.
   * @param {number} x - The x position of the hex in the canvas.
   * @param {number} y - The y position of the hex in the canvas.
   * @param {number} q - The cube coordinate q.
   * @param {number} r - The cube coordinate r.
   * @param {number} s - The cube coordinate s.
   * @param {number} biome - biome representation
   * @param {boolean} blocked - toggles blocking player access
   * @param {set} npcs - npcs located on this hexagon
   * @param {set} objects - objects placed on top of the hexagon
    */
  constructor(x, y, q, r, s, biome, blocked, npcs, objects) {
    this._cube = new Hex(q, r, s);
    this._point = new Point(x, y);
    this._biome = biome;
    this._blocked = blocked;
    this._npcs = npcs;
    this._objects = objects;
  }
  get q() {
    return this._cube.q;
  }
  get r() {
    return this._cube.r;
  }
  get s() {
    return this._cube.s;
  }
  get x() {
    return this._point.x;
  }
  get y() {
    return this._point.y;
  }
  get point() {
    return this._point;
  }
  get cube() {
    return this._cube;
  }
  get biome() {
    return this._biome;
  }
  get blocked() {
    return this._blocked;
  }
  get npcs() {
    return this._npcs;
  }
  get objects() {
    return this._objects;
  }

  evenr_coord() {
    return this._cube.to_evenr();
  }
  neighbor(direction) {
    return this._cube.neighbor(direction);
  }
}

export { Tile };
export default Tile;
/**
 *
 * $KYAULabs: pathfinding.mjs,v 1.0.0 2024/10/09 13:46:25 -0700 kyau Exp $
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

/**
 * Class representing the pathfinding algorithms.
 */
class Pathfinding {
  static breadth_first_search(start, blocked) {
    let cost_so_far = {};
    cost_so_far[start] = 0;
    let came_from = {};
    came_from[start] = null;
    let fringes = [[start]];
    for (let k = 0; fringes[k].length > 0; k++) {
      fringes[k+1] = [];
      for (let hex of fringes[k]) {
        for (let dir = 0; dir < 6; dir++) {
          const neighbor = hex.neighbor(dir);
          if (cost_so_far[neighbor] === undefined && !blocked(neighbor)) {
            cost_so_far[neighbor] = k + 1;
            came_from[neighbor] = hex;
            fringes[k + 1].push(neighbor);
          }
        }
      }
    }
    return {
      cost_so_far,
      came_from
    };
  }
  static linedraw(a, b) {
    const N = a.distance(b);
    const a_nudge = new Hex(a.q + 1e-06, a.r + 1e-06, a.s - 2e-06);
    const b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
    const step = 1.0 / Math.max(N, 1);
    let results = [];
    for (let i = 0; i <= N; i++) {
      const hex = a_nudge.lerp(b_nudge, step * i).round();
      results.push(`${hex.q},${hex.r},${hex.s}`);
    }
    return results;
  }
  static ring(radius) {
    let results = [];
    let H = Hex.direction(4).scale(radius);
    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < radius; step++) {
        results.push(`${H.q},${H.r},${H.s}`);
        H = H.neighbor(side);
      }
    }
    return results;
  }
}

export { Pathfinding };
export default Pathfinding;
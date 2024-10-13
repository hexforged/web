/**
 *
 * $KYAULabs: hexgrid.mjs,v 1.0.0 2024/10/09 13:39:35 -0700 kyau Exp $
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

import { Canvas } from './canvas.min.mjs';
import { Color } from './color.min.mjs';
import { Hex } from './hex.min.mjs';
import { Log } from './logger.min.mjs';
import { OffsetCoord } from './offsetcoord.min.mjs';
import { Ring } from './ring.min.mjs';
import { Tile } from './tile.min.mjs';

/**
 * 2π radians converted to degrees (360).
 * @constant {number}
 */
const RADIANS_TO_DEGREES = Math.PI / 2;
/**
 * The square root of 3, computed once and used twice.
 * @constant {number}
 */
const SQRT3 = Math.sqrt(3);
/**
 * The radius value used for drawing hexagons.
 * @constant {number}
 */
const HEX_RADIUS = 30;
/**
 * The height of a single hexagon.
 * @constant {number}
 */
const HEX_HEIGHT = HEX_RADIUS * 2;
/**
 * The width of a single hexagon.
 * @constant {number}
 */
const HEX_WIDTH = SQRT3 * HEX_RADIUS;
/**
 * The vertical spacing used for hexagon placement.
 * @constant {number}
 */
const HEX_VERT_SPACING = HEX_HEIGHT * 0.75;


class HexGrid {
  constructor(map_data) {
    this.map = JSON.parse(map_data);
    this.origin = this.map.origin;
    this.grid = new Map();

    // development
    this.cursor_line_highlight = true;
    this.cursor_ring_highlight = true;
    this.grid_axis_highlight = false;
    this.line = [];
    this.ring = [];

    Log.info(`map: ${this.map.name.toLowerCase()} (${this.map.size.width}x${this.map.size.height}) loaded`);
    this.init();
  }

  init() {
    const x = Canvas.canvas.width / 2;
    const y = Canvas.canvas.height / 2;
    let this_q, this_r;
    let biome = this.map.hexes[`${this.origin.q},${this.origin.r}`].biome;
    let blocked = this.map.hexes[`${this.origin.q},${this.origin.r}`].blocked;
    let npcs = this.map.hexes[`${this.origin.q},${this.origin.r}`].npcs;
    let objects = this.map.hexes[`${this.origin.q},${this.origin.r}`].objects;

    this.grid.set(`0,0,0`, { hex: new Tile(x, y, 0, 0, 0, biome, blocked, npcs, objects) });

    for (let grid_size = 1; grid_size <= Canvas.radius; grid_size++) {
      const ptnum = 3 * grid_size * (grid_size + 1) + 1;
      const ring_index = Math.floor(Math.sqrt(ptnum / 3.0));
      const ring = new Ring(ring_index, ptnum);

      for (let ring_count = 0; ring_count < ring.total; ring_count++) {
        const ring_half_count = ring_count % (ring_index * 3);
        const ring_edge = Math.floor(ring_count / ring.index);
        let r_pos = ring_half_count < (3 * ring.index * 0.5) ? ring_half_count : (ring.index * 3) - ring_half_count;
        r_pos = r_pos > ring.index ? ring.index : r_pos;
        r_pos = r_pos * Canvas.triangle(ring_count, ring.index * 3, 0);
        const partA = ring_index * Canvas.waveform(ring_edge, ring.index, ring_count, 1);
        const partB = (ring_count % ring.index) * Canvas.waveform(ring_edge, ring.index, ring_count, 0);
        const q_pos = Math.round((partA - partB));

        const x_pos = x + Math.round((partA - partB) * (HEX_WIDTH));
        const y_pos = y + r_pos * HEX_VERT_SPACING;

        this_q = q_pos + this.origin.q;
        this_r = r_pos + this.origin.r;
        /*
        if (this.map.hexes[`${this_q},${this_r}`] !== undefined) {
          biome = this.map.hexes[`${this_q},${this_r}`].biome;
          blocked = this.map.hexes[`${this_q},${this_r}`].blocked;
          npcs = this.map.hexes[`${this_q},${this_r}`].npcs;
          objects = this.map.hexes[`${this_q},${this_r}`].objects;
        } else {
          // if tile does not exist on map make it blocked water tile
          biome = 4;
          blocked = true;
          npcs = [];
          objects = [];
        }
        */
        let data = this.get_hex(this_q, this_r);
        const cube = new OffsetCoord(q_pos, r_pos).to_cube();

        this.grid.set(`${cube.q},${cube.r},${cube.s}`, { hex: new Tile(x_pos, y_pos, cube.q, cube.r, cube.s, data.biome, data.blocked, data.npcs, data.objects) });
        
        // development
        this.line = [];
        this.ring = [];
      }
    }
  }
  
  draw() {
    Canvas.ctx.font = 'bold 10pt SUSE'
    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.strokeStyle = 'rgba(19,19,19,1)'

    const mouse_on_grid = Canvas.mouse_position.on_grid(Canvas.radius)
    const hex_center = new Hex(0,0,0)

    if (mouse_on_grid) {
      if (this.cursor_ring_highlight) {
        // compute hex ring of target hex on mouse over
        this.ring = this.get_ring(hex_center.distance(Canvas.mouse_position))
      }
      if (this.cursor_line_highlight) {
        // line draw to target hex on mouse over
        this.line = hex_center.linedraw(Canvas.mouse_position)
      }
      if (!this.cursor_ring_highlight && !this.cursor_line_highlight) {
        this.ring = []
        this.line = []
      }
    } else {
      this.ring = []
      this.line = []
    }

    for (let [key, value] of this.grid.entries()) {
      const hex = value.hex

      //Log.info(`[${hex.q}, ${hex.r}, ${hex.s}] x,y: ${key}`)

      Canvas.ctx.beginPath()
      Canvas.polygon(hex.x, hex.y, HEX_RADIUS, 6, RADIANS_TO_DEGREES)

      // Determine fill color
      let rgba = Color.coords.def

      if (hex.biome in Color.biomes) {
        rgba = Color.biomes[hex.biome]
        //Log.info('biome: '+biomes[hex.biome].color)
      }

      if (this.grid_axis_highlight) {
        if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
          rgba = Color.coords.origin
        } else if (hex.q == 0) {
          rgba = Color.coords.q
        } else if (hex.r == 0) {
          rgba = Color.coords.r
        } else if (hex.s == 0) {
          rgba = Color.coords.s
        }
      }
      // highlight current moused over hexagon
      const mouse_on_hex = hex.cube.compare(Canvas.mouse_position)
      if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
        rgba = Color.coords.origin
      } else if (mouse_on_grid && mouse_on_hex) {
        rgba = Color.coords.highlight
      } else if (mouse_on_grid && this.ring.includes(`${hex.q},${hex.r},${hex.s}`)) {
        // highlight hex ring of target hex on mouse over
        rgba = Color.coords.highlight_ring
      } else if (mouse_on_grid && this.line.includes(`${hex.q},${hex.r},${hex.s}`)) {
        // line draw to target hex on mouse over
        rgba = Color.coords.r
      }
      Canvas.ctx.fillStyle = `rgba(${rgba.color.r},${rgba.color.g},${rgba.color.b},${rgba.opacity})`
      Canvas.ctx.fill()

      // Draw stroke
      Canvas.ctx.stroke()

      // Draw text
      Canvas.ctx.fillStyle = 'rgb(19, 19, 19)'
      if (hex.r == 0 && hex.q == 0) {
        Canvas.ctx.fillText(`q, r, s`, hex.x, hex.y)
      } else if (mouse_on_grid && mouse_on_hex) {
        Canvas.ctx.fillText(`${hex.q}, ${hex.r}, ${hex.s}`, hex.x, hex.y)
      } else {
        Canvas.ctx.fillStyle = 'rgb(150, 150, 150)'
        Canvas.ctx.fillText(`${hex.q}, ${hex.r}, ${hex.s}`, hex.x, hex.y)
      }
    }
  }
  
  get_hex(q, r) {
    return this.map.hexes[`${q},${r}`] || { biome: 4, blocked: true, npcs: [], objects: [] };
  }
  
  get_ring(radius) {
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

  rebuild() {
    this.grid = new Map();
    this.init();
  }
}

export { HexGrid };
export default HexGrid;
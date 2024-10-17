/**
 *
 * $KYAULabs: canvas.mjs,v 1.0.1 2024/10/17 14:39:58 -0700 kyau Exp $
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
 * Ratio of a circle's circumference to its radius.
 * @constant {number}
 */
const TAU = Math.PI * 2;
/**
 * The square root of 3, computed once and used twice.
 * @constant {number}
 */
const SQRT3 = Math.sqrt(3);
/**
 * The radius value used for drawing hexagons.
 * @constant {number}
 */
export const HEX_RADIUS = 30;
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
 * Class representing a canvas for drawing and interacting with elements.
 */
class Canvas {
  /**
   * Create a new Canvas instance with initial dimensions.
   */
  constructor() {
    /**
     * Singleton
     */
    if (Canvas._instance) {
      return Canvas._instance;
    }
    Canvas._instance = this;

    /**
     * The static canvas element.
     * @type {HTMLCanvasElement}
     */
    Canvas.canvas = document.getElementById('hexforged');

    /**
     * The 2D rendering context for the canvas.
     * @type {CanvasRenderingContext2D}
     */
    Canvas.ctx = Canvas.canvas.getContext('2d');

    /*
     * @property {number} canvas_width - The current width of the canvas.
     * @property {number} canvas_height - The current height of the canvas.
     * @property {number} old_canvas_width - The previous width of the canvas.
     * @property {number} old_canvas_height - The previous height of the canvas.
     * @property {Point} mouse_offset - Mouse offset based on canvas location.
     */
    this.canvas = Canvas.canvas;
    this.ctx = Canvas.ctx;
    this.canvas_width = 0;
    this.canvas_height = 0;
    this.old_canvas_width = 0;
    this.old_canvas_height = 0;
    Canvas.images = {};
    Canvas.mouse_offset = new Point();
    Canvas.mouse_position = new Hex(NaN, NaN, NaN);
    Canvas.radius = 0;
    Canvas.game_state = NaN;

    Canvas.AVATAR_SIZE = 80;
    Canvas.AVATAR_GAP = 20;
    Canvas.AVATAR_START = new Point();
    Canvas.AVATAR_END = new Point();
    Canvas.AVATAR = 0;
    Canvas.CLASS_SELECTED = 0;
    Canvas.GENDER_SELECTED = 0;

    Canvas.set_radius();

    /**
     * Events
     */
    Canvas.canvas.onclick = Canvas.mouse_click;
    Canvas.canvas.onmousemove = Canvas.mouse_move;
    Canvas.canvas.onmouseout = Canvas.mouse_out;
    window.addEventListener('resize', this.set_dimensions);
    
    return Canvas._instance;
  }
  
  /**
   * Clear the canvas and fill it with a semi-transparent background.
   */
  static clear() {
    // Clear the entire canvas
    Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);

    // Fill the canvas with a semi-transparent black background
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    Canvas.ctx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
  }

  static mouse_avatar_class(event, rect) {
    const point = new Point(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    if (Canvas.canvas.width > 360) {
      if (point.y >= Canvas.AVATAR_START.y && point.y <= Canvas.AVATAR_END.y) {
        if (point.x >= Canvas.AVATAR_START.x && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE)) {
          // avatar 1
          return 1;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 2
          return 2;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP * 2) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 3 + Canvas.AVATAR_GAP * 2)) {
          // avatar 3
          return 3;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 3 + Canvas.AVATAR_GAP * 3) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 4 + Canvas.AVATAR_GAP * 3)) {
          // avatar 4
          return 4;
        } else {
          return 0;
        }
      } else if (point.y >= (Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE) && point.y <= (Canvas.AVATAR_END.y + Canvas.AVATAR_SIZE)) {
        if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 5
          return 5;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP * 2) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 3 + Canvas.AVATAR_GAP * 2)) {
          // avatar 6
          return 6;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      if (point.y >= Canvas.AVATAR_START.y && point.y <= Canvas.AVATAR_END.y) {
        if (point.x >= Canvas.AVATAR_START.x && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE)) {
          // avatar 1
          return 1;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 2
          return 2;
        } else {
          return 0;
        }
      } else if (point.y >= (Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE) && point.y <= (Canvas.AVATAR_END.y + Canvas.AVATAR_SIZE)) {
        if (point.x >= Canvas.AVATAR_START.x && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE)) {
          // avatar 3
          return 3;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 4
          return 4;
        } else {
          return 0;
        }
      } else if (point.y >= (Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE * 2) && point.y <= (Canvas.AVATAR_END.y + Canvas.AVATAR_SIZE * 2)) {
        if (point.x >= Canvas.AVATAR_START.x && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE)) {
          // avatar 5
          return 5;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 6
          return 6;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }

  static mouse_avatar_gender(event, rect) {
    const point = new Point(
      event.clientX - rect.left,
      event.clientY - rect.top
    );

    if (Canvas.canvas.width > 360) {
      if (point.y >= Canvas.AVATAR_START.y && point.y <= Canvas.AVATAR_END.y) {
        if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 1
          return 1;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP * 2) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 3 + Canvas.AVATAR_GAP * 2)) {
          // avatar 2
          return 2;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      if (point.y >= (Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE) && point.y <= (Canvas.AVATAR_END.y + Canvas.AVATAR_SIZE)) {
        if (point.x >= Canvas.AVATAR_START.x && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE)) {
          // avatar 1
          return 1;
        } else if (point.x >= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE + Canvas.AVATAR_GAP) && point.x <= (Canvas.AVATAR_START.x + Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP)) {
          // avatar 2
          return 2;
        } else {
          return 0;
        }
      }
    }
  }

  static mouse_click(event) {
    const rect = this.getBoundingClientRect();
    if (Canvas.game_state === 'select-class') {
      Canvas.CLASS_SELECTED = Canvas.mouse_avatar_class(event, rect);
    } else if (Canvas.game_state === 'select-gender') {
      Canvas.GENDER_SELECTED = Canvas.mouse_avatar_gender(event, rect);
    }
  }

  static mouse_move(event) {
    const rect = this.getBoundingClientRect();
    if (Canvas.game_state === 'map') {
      const point = new Point(
        event.clientX - rect.left - this.width / 2,
        event.clientY - rect.top - this.height / 2
      );
      Canvas.mouse_position = point.to_cube(HEX_RADIUS);

      if (Canvas.mouse_position.on_grid(Canvas.radius)) {
        this.style.cursor = 'pointer';
      } else {
        this.style.cursor = 'default';
      }
    } else if (Canvas.game_state === 'select-class') {
      Canvas.AVATAR = Canvas.mouse_avatar_class(event, rect);
      if ((Canvas.AVATAR > 0 && Canvas.AVATAR < 4) || (Canvas.AVATAR > 5 && Canvas.AVATAR < 7)) {
        this.style.cursor = 'pointer';
      } else {
        this.style.cursor = 'default';
      }
    } else if (Canvas.game_state === 'select-gender') {
      Canvas.AVATAR = Canvas.mouse_avatar_gender(event, rect);
      if (Canvas.AVATAR > 0 && Canvas.AVATAR < 3) {
        this.style.cursor = 'pointer';
      } else {
        this.style.cursor = 'default';
      }
    } else {
      if (this.style.cursor === 'pointer') {
        this.style.cursor = 'default';
        Canvas.AVATAR = 0;
      }
    }
  }

  static mouse_out(event) {
    if (Canvas.game_state === 'map') {
      Canvas.mouse_position = new Hex(NaN, NaN, NaN);
    }
  }

  was_resized() {
    if (parseInt(this.old_canvas_width) !== parseInt(this.canvas_width) || parseInt(this.old_canvas_height) !== parseInt(this.canvas_height)) {
      this.set_dimensions();
      return true;
    }
    return false;
  }

  /**
   * Set the canvas dimensions based on the container element.
   */
  set_dimensions() {
    const container = document.getElementById("canvas").getBoundingClientRect();

    // Save the previous canvas dimensions
    this.old_canvas_width = this.canvas.width;
    this.old_canvas_height = this.canvas.height;

    // Update the canvas dimensions to match the responsive container
    this.canvas.width = this.canvas_width = container.width;
    this.canvas.height = this.canvas_height = container.height;

    // Update mouse offset based on container positioning
    Canvas.mouse_offset = new Point(container.left, container.right);

    // constants based on container size
    if (Canvas.canvas.width > 360) {
      Canvas.AVATAR_START = new Point((Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP + 10), Canvas.canvas.height / 2 - (Canvas.AVATAR_SIZE / 2));
      Canvas.AVATAR_END = new Point((Canvas.canvas.width / 2) + (Canvas.AVATAR_SIZE * 2 + Canvas.AVATAR_GAP + 10), Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE);
    } else {
      Canvas.AVATAR_START = new Point((Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE);
      Canvas.AVATAR_END = new Point((Canvas.canvas.width / 2) + (Canvas.AVATAR_SIZE + 10), Canvas.AVATAR_START.y + Canvas.AVATAR_SIZE);
    }

    Canvas.set_radius();
  }

  static set_radius() {
    Canvas.radius = Math.min(Math.floor((Canvas.canvas.width / HEX_WIDTH) / 2), Math.floor((Canvas.canvas.height / HEX_HEIGHT) / 2));
  }

  /**
   * Calculates a triangle wave value.
   * @param {number} input - The input value.
   * @param {number} multiplier - The multiplier applied to the wave.
   * @param {number} offset - The offset applied to the wave.
   * @returns {number} The resulting triangle wave value.
   */
  static triangle(input, multiplier, offset) {
    return (input + offset) % (2 * multiplier) < multiplier ? 1 : -1;
  }

  /**
   * Generates a waveform based on ring geometry.
   * @param {number} ring_edge - The edge of the current ring.
   * @param {number} ring_index - The index of the current ring.
   * @param {number} ring_count - The number of hexes in the ring.
   * @param {number} offset - The offset applied to the wave.
   * @returns {number} The calculated waveform value.
   */
  static waveform(ring_edge, ring_index, ring_count, offset) {
    const mod = (ring_edge + offset) % 3;
    let output = (mod % 2 + 1) * 0.5;
    output = output * Canvas.triangle(ring_count, 3 * ring_index, ring_index * offset);
    return output;
  }

  /**
   * Draws a polygon shape on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} x - The x coordinate of the polygon center.
   * @param {number} y - The y coordinate of the polygon center.
   * @param {number} radius - The radius of the polygon.
   * @param {number} sides - The number of sides of the polygon.
   * @param {number} startAngle - The starting angle of the polygon in radians.
   */
  static polygon(x, y, radius, sides, startAngle) {
    if (sides < 3) return;
    var a = TAU / sides;
    Canvas.ctx.save();
    Canvas.ctx.translate(x, y);
    Canvas.ctx.rotate(startAngle);
    Canvas.ctx.moveTo(radius, 0);
    for (let i = 1; i < sides; i++) {
      Canvas.ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
    }
    Canvas.ctx.closePath();
    Canvas.ctx.restore();
  }
}

export { Canvas };
export default Canvas;
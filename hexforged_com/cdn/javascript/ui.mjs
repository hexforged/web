/**
 *
 * $KYAULabs: ui.mjs,v 1.0.0 2024/10/09 13:54:29 -0700 kyau Exp $
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

class UI {
  constructor() {
  }
  
  /**
   * Draw coordinates on the canvas based on the hex object.
   * @param {Hex} hex - The hexagonal coordinate object.
   */
  static draw_coords(hex) {
    // Validate that the hex object has valid coordinates
    if (hex.q !== hex.q || hex.r !== hex.r || hex.s !== hex.s) {
      return;
    }

    Canvas.ctx.textAlign = 'left';
    Canvas.ctx.font = 'bold 10pt Agave';

    // Check if hex is out of range
    if (Math.max(Math.abs(hex.q), Math.abs(hex.r), Math.abs(hex.s)) > Canvas.radius) {
      Canvas.ctx.fillStyle = 'rgba(150,0,0,1)';
      Canvas.ctx.fillText(`${hex.q},${hex.r},${hex.s} out-of-range!`, 12, Canvas.canvas.height - 16);
    } else {
      // Determine fill color based on cube coordinates
      let rgba;
      if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
        rgba = Color.coords.origin.color;
      } else if (hex.q == 0) {
        rgba = Color.coords.q.color;
      } else if (hex.r == 0) {
        rgba = Color.coords.r.color;
      } else if (hex.s == 0) {
        rgba = Color.coords.s.color;
      } else {
        rgba = Color.coords.text.color;
      }

      Canvas.ctx.fillStyle = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
      Canvas.ctx.fillText(`${hex.q},${hex.r},${hex.s}`, 12, Canvas.canvas.height - 16);
    }
  }

  /**
   * Draws the current connection state on the canvas.
   */
   static draw_conn_state(state) {
    Canvas.clear();
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    Canvas.ctx.fillRect(0, 0, Canvas.canvas.width, Canvas.canvas.height);
    Canvas.ctx.textAlign = 'center';
    Canvas.ctx.font = 'bold 10pt Agave';
    if (state === 'disconnected') {
      Canvas.ctx.fillStyle = 'rgba(150,0,0,1)';
      Canvas.ctx.fillText(`Server disconnected!`, Canvas.canvas.width / 2, Canvas.canvas.height / 2);
    } else if (state === 'connected') {
      Canvas.ctx.fillStyle = 'rgba(0,150,0,1)';
      Canvas.ctx.fillText(`Connected!`, Canvas.canvas.width / 2, Canvas.canvas.height / 2);
    } else {
      Canvas.ctx.fillStyle = 'rgba(150,150,150,1)';
      Canvas.ctx.fillText(`Connecting...`, Canvas.canvas.width / 2, Canvas.canvas.height / 2);
    }
   }

  /**
   * Draws the current FPS on the canvas.
   */
  static draw_fps(fps) {
    Canvas.ctx.textAlign = 'right';
    Canvas.ctx.font = 'bold 10pt Agave';
    Canvas.ctx.fillStyle = 'rgba(0,150,0,1)';
    Canvas.ctx.fillText(fps + " fps", Canvas.canvas.width - 12, 16);
  }

  /**
   * Draws the current FPS on the canvas.
   */
  static draw_latency(latency) {
    Canvas.ctx.textAlign = 'right';
    Canvas.ctx.font = 'bold 10pt Agave';
    let rgba = 'rgba(0,150,0,1)';
    if (latency <= 75) {
      
    }
    Canvas.ctx.fillStyle = 'rgba(0,150,0,1)'
    Canvas.ctx.fillText(latency + " ms", Canvas.canvas.width - 12, 32)
  }
}

export { UI };
export default UI;
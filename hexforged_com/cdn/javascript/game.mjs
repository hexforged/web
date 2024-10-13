/**
 *
 * $KYAULabs: game.mjs,v 1.0.0 2024/10/09 13:26:13 -0700 kyau Exp $
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
import { HexGrid } from './hexgrid.min.mjs';
import { Log } from './logger.min.mjs';
import { UI } from './ui.min.mjs';

const MAP_DATA = `{
  "name": "Nova Civitas",
  "layout": "even-r",
  "size": {
      "height": 9,
      "width": 9
  },
  "origin": {
    "q": 4,
    "r": 4
  },
  "hexes": {
      "0,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,0": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "2,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "7,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,0": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,1": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,1": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "2,1": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "3,1": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "4,1": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "5,1": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "6,1": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "7,1": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,1": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,2": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "7,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,2": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,3": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "7,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,3": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,4": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "1,4": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "2,4": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "3,4": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,4": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,4": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,4": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "7,4": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "8,4": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,5": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "6,5": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "7,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,5": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,6": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,6": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,6": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,6": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "4,6": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "5,6": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "6,6": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "7,6": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "8,6": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "0,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "7,7": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "8,7": {
          "biome": 4,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "0,8": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "1,8": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "2,8": {
          "biome": 0,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "3,8": {
          "biome": 3,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "4,8": {
          "biome": 3,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "5,8": {
          "biome": 3,
          "blocked": false,
          "npcs": [],
          "objects": []
      },
      "6,8": {
          "biome": 5,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "7,8": {
          "biome": 5,
          "blocked": true,
          "npcs": [],
          "objects": []
      },
      "8,8": {
          "biome": 5,
          "blocked": true,
          "npcs": [],
          "objects": []
      }
 },
  "boundaries": {

  }
}`

/**
 * Class representing the game loop.
 */
class Game {
  /**
   * Creates a new Game instance.
   */
  constructor(hostname, show_fps) {
    this.active = false;
    this.state = 'disconnected';
    this.canvas = new Canvas();
    this.grid;
    
    // socket.io
    this.hostname = hostname;
    this.latency = NaN;
    this.time = 0.5;

    // fps counter
    this.fps = 0;
    this.show_fps = show_fps;
    this.current_time = performance.now();
    this.last_time = this.current_time;
    this.alpha = 0;

    // game tick
    this.loops = 0;
    this.sim_fps = 64;
    this.skip_ticks = 1000 / this.sim_fps;
    this.max_frame_skip = 10;
    this.next_game_tick = performance.now();
    this.reconnect = 0;
    
    Log.info('game initialized');
    this.init();
  }

  /**
   * Initializes the game, clears the canvas, and prepares the grid.
   */
  init() {
    this.canvas.set_dimensions();
    Canvas.clear();
    // initialize game
    this.grid = new HexGrid(MAP_DATA);

    this.state = 'connecting';
    this.setup_network(this.hostname);
    
    this.current_time = performance.now();
  }

  /**
   * Updates the game latency.
   * @param {number} ms - The latency in milliseconds.
   */
  latency_update(ms) {
    this.latency = ms;
    this.socket.emit('pong', {latency: ms});
  }

  /**
   * Sets up the network connection to the given IP and port.
   * @param {string} [ip='localhost'] - The IP address or hostname to connect to.
   * @param {string} [path=''] - The path number to connect to.
   */
  setup_network(ip = 'localhost', path = '') {
    this.socket = io.connect(`https://${ip}/${path}`, {
      path: '/dolphin/'
    });
    this.socket.on('connect', () => {
      this.state = 'connected';
      Log.success('dolpin connected');
      this.reconnect = 0;
      setInterval(() => {
        const start = Date.now();
        this.socket.volatile.emit('ping', () => {
          this.latency_update(Date.now() - start);
        });
      }, 2000);
    });
    this.socket.on('connect_error', (error) => {
      this.state = 'connecting';
      Log.warn(`dolpin reconnecting...`);
      if (error.message === 'xhr poll error')
        this.reconnect += 1;
      if (this.reconnect == 5) {
        this.state = 'disconnected';
        this.socket.disconnect();
        this.latency = NaN;
        this.stop();
      }
    });
    this.socket.on('error', (error) => {
      Log.error(error);
    });
    this.socket.on('disconnect', (reason, details) => {
      if (!this.socket.active) {
        this.state = 'disconnected';
        this.latency = NaN;
        this.stop();
      }
    });
    this.socket.on('hello', (text) => {
      Log.success(`${text.hello} authenticated`);
    });
    //this.socket.on('pong', this.latency_update.bind(this));
  }

  /**
   * Performs the logic for a single game tick.
   */
  game_tick() {
    if (this.time >= 4)
      this.time = 0;

    this.canvas.set_dimensions();
  }

  /**
   * Render the current frame to the canvas.
   */
  render() {
    Canvas.clear();

    // Rebuild the grid if the canvas has been resized
    if (this.canvas.was_resized()) {
      this.grid.rebuild();
      //Log.info(`grid radius changed ${this.grid.old_grid_radius} => ${this.grid.grid_radius}`);
    }

    if (this.socket.connected) {
      this.grid.draw();
    }
  }

  /**
   * Updates and displays the game's user interface.
   */
  render_ui() {
    if (this.show_fps) {
      // Calculate the number of seconds passed since the last frame
      let seconds_passed = this.delta / 1000;

      // Calculate FPS
      this.fps = Math.round(1 / seconds_passed);

      // Draw FPS Counter
      UI.draw_fps(this.fps);
      
      // Draw Latency Meter
      UI.draw_latency(this.latency);
    }

    // Show mouse coordinates
    UI.draw_coords(Canvas.mouse_position);
  }

  /**
   * The main game loop that updates game state and draws the frame.
   */
  loop() {
    if (this.active) {
      requestAnimationFrame(this.loop.bind(this));
    } else {
      return;
    }
    if (!this.socket.active) {
      this.socket.disconnect();
    }
    this.last_time = this.current_time;
    this.current_time = performance.now();
    this.delta = this.current_time - this.last_time;
    
    this.loops = 0;
    
    while (this.current_time > this.next_game_tick && this.loops < this.max_frame_skip) {
      this.loops++;
      this.game_tick();
      this.next_game_tick += this.skip_ticks;
    }

    this.render();
    if (this.socket.connected) {
      this.render_ui();
    } else {
      if (this.state === 'connected') {
        UI.draw_conn_state('connected');
      } else {
        UI.draw_conn_state('connecting');
      }
    }
  }
  
  start() {
    this.active = true;
    Log.success('game started');
    this.loop();
  }
  
  stop() {
    Log.error('dolphin disconnected');
    UI.draw_conn_state('disconnected');
    this.active = false;
  }
}

export { Game };
export default Game;
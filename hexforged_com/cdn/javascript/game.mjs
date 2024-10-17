/**
 *
 * $KYAULabs: game.mjs,v 1.0.1 2024/10/17 14:40:54 -0700 kyau Exp $
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
import { PC, NPC } from './character.min.mjs';
import { HexGrid } from './hexgrid.min.mjs';
import { Log } from './logger.min.mjs';
import { UI } from './ui.min.mjs';
import { preload_images } from './utils.min.mjs';

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
    this.username = '';
    this.character;
    this.grid = null;
    this.map = null;
    
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
    //this.grid = new HexGrid(MAP_DATA);

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
      Canvas.game_state = null;
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
      if (error === 'already logged in') {
        UI.draw_conn_state('logged_in');
      }
    });
    this.socket.on('disconnect', (reason, details) => {
      if (!this.socket.active) {
        this.state = 'disconnected';
        this.latency = NaN;
        this.stop();
      }
    });
    // user authentication
    this.socket.on('hello', async (text) => {
      this.username = text.username;
      Log.success(`${this.username} authenticated`);

      // get character data
      const char = await this.socket.emitWithAck('get-character');
      if (Object.keys(char).length !== 0) {
        Log.success('character loaded')
        // set the player character
        this.character = new PC(char);
        UI.update_avatar(this.character);
        // get the worldmap
        this.map = await this.socket.emitWithAck('get-worldmap');
        if (this.map !== null) {
          this.grid = new HexGrid(this.map);
          Canvas.game_state = 'map';
        }
      } else {
        const classes = [
          `classes/bard.png`,
          `classes/cleric.png`,
          `classes/fighter.png`,
          `classes/monk.png`,
          `classes/rogue.png`,
          `classes/wizard.png`,
          `genders/mars.png`,
          `genders/venus.png`,
          `backgrounds/bg-select.png`,
        ];
        [Canvas.images.bard, Canvas.images.cleric, Canvas.images.fighter, Canvas.images.monk, Canvas.images.rogue, Canvas.images.wizard, Canvas.images.mars, Canvas.images.venus, Canvas.images.bg_select] = await preload_images(classes);
        const classes_gray = [
          `classes/bard-gray.png`,
          `classes/cleric-gray.png`,
          `classes/fighter-gray.png`,
          `classes/monk-gray.png`,
          `classes/rogue-gray.png`,
          `classes/wizard-gray.png`,
          `genders/mars-gray.png`,
          `genders/venus-gray.png`,
        ];
        [Canvas.images.bard_gray, Canvas.images.cleric_gray, Canvas.images.fighter_gray, Canvas.images.monk_gray, Canvas.images.rogue_gray, Canvas.images.wizard_gray, Canvas.images.mars_gray, Canvas.images.venus_gray] = await preload_images(classes_gray);
        Canvas.game_state = 'select-class';
      }
    });
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
  async render() {
    Canvas.clear();

    if (Canvas.game_state === 'select-class') {
      // TODO: render character creation
      PC.draw_class_select();
      if (Canvas.CLASS_SELECTED > 0) {
        Canvas.game_state = 'loading';
        Canvas.game_state = 'select-gender';
      }
    } else if (Canvas.game_state === 'select-gender') {
      // TODO: render character creation
      PC.draw_gender_select();
      if (Canvas.GENDER_SELECTED > 0) {
        Canvas.game_state = 'loading';
        const class_name = PC.CLASSES[Canvas.CLASS_SELECTED-1];
        const gender_name = PC.GENDERS[Canvas.GENDER_SELECTED-1];
        Log.info(`create ${gender_name} ${class_name}`);
        const char = await this.socket.emitWithAck('create-character', {class: Canvas.CLASS_SELECTED, gender: Canvas.GENDER_SELECTED});
        if (Object.keys(char).length !== 0) {
          Log.success('character created')
          // set the player character
          this.character = new PC(char);
          UI.update_avatar(this.character);
          // get the worldmap
          this.map = await this.socket.emitWithAck('get-worldmap');
          if (this.map !== null) {
            this.grid = new HexGrid(this.map);
            Canvas.game_state = 'map';
          }
        }
      }
    } else if (Canvas.game_state === 'map') {
      // Rebuild the grid if the canvas has been resized
      if (this.canvas.was_resized()) {
        this.grid.rebuild();
        //Log.info(`grid radius changed ${this.grid.old_grid_radius} => ${this.grid.grid_radius}`);
      }

      if (this.socket.connected) {
        this.grid.draw();
      }
    }
  }

  /**
   * Updates and displays the game's user interface.
   */
  async render_ui() {
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

    if (Canvas.game_state === 'map') {
      // Show mouse coordinates
      UI.draw_coords(Canvas.mouse_position);
    }
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
    Canvas.game_state = null;
    this.active = false;
  }
}

export { Game };
export default Game;
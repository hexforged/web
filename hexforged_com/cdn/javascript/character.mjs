/**
 *
 * $KYAULabs: character.mjs,v 1.0.0 2024/10/14 11:01:33 -0700 kyau Exp $
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
import { Hex } from './hex.min.mjs'
import { Inventory } from './inventory.min.mjs';

/**
 * Base movement speed.
 * @constant {number}
 */
const BASE_SPEED = 0.5;
/**
 * The number of inventory slots per character.
 * @constant {number}
 */
const INV_SLOTS = 16;
/**
 * The number of drop slots for npcs.
 * @constant {number}
 */
const NPC_NUM_DROPS = 5;

/**
 * Class representing a character.
 */
class Character {
  /**
   * Create a new Character instance.
   */
  constructor(data) {
    this._class = data.class;
    this._level = Object.hasOwn(data, 'level') ? data.level : 1;
    this._experience = Object.hasOwn(data, 'experience') ? data.experience : 1;
    this._hp = Object.hasOwn(data, 'hp') ? data.hp : 25;
    this._hp_max = Object.hasOwn(data, 'hp_max') ? data.hp : this._hp;
    this._mp = Object.hasOwn(data, 'mp') ? data.mp : 10;
    this._mp_max = Object.hasOwn(data, 'mp_max') ? data.mp : this._mp;
    this._attack = Object.hasOwn(data, 'attack') ? data.attack : 5;
    this._magic = Object.hasOwn(data, 'magic') ? data.magic : 5;
    this._defense = Object.hasOwn(data, 'defense') ? data.defense : 5;

    this._location = Object.hasOwn(data, 'location') ? data.location : new Hex(data.pos_q, data.pos_r, data.pos_s);
    this._speed = Object.hasOwn(data, 'speed') ? data.speed : BASE_SPEED;

    this._alive = true;
  }

  get class() {
    return this._class;
  }

  get class_name() {
    return Character.CLASSES[this._class - 1];
  }

  get level() {
    return this._level;
  }

  get health() {
    return [ this._hp, this._hp_max ];
  }

  get mana() {
    return [ this._mp, this._mp_max ];
  }

  get attack() {
    return this._attack;
  }

  get defense() {
    return this._defense;
  }

  get position() {
    return this._location;
  }

  get speed() {
    return this._speed;
  }

  set level(level) {
    if (level > 0) {
      this._level = level;
      return true;
    }
    return false;
  }

  set health(num) {
    this._hp += num;
    if (this._hp <= 0) {
      this.alive = false;
    }
    return true;
  }

  set health_max(num) {
    if (num > 0) {
      this._hp_max = num;
      return true;
    }
    return false;
  }

  set mana(num) {
    this._mp += num;
    if (this._mp < 0) {
      this._mp = 0;
    }
    return true;
  }

  set mana_max(num) {
    if (num > 0) {
      this._mp_max = num;
      return true;
    }
    return false;
  }

  set attack(atk) {
    if (atk > 0) {
      this._attack = atk;
      return true;
    }
    return false;
  }

  set defense(def) {
    if (def > 0) {
      this._defense = def;
      return true;
    }
    return false;
  }

  set location(hex) {
    if (hex instanceof Hex && !hex.nan()) {
      this._location = hex;
      return true;
    }
    return false;
  }

  set speed(num) {
    if (num >= BASE_SPEED) {
      this._speed = num;
      return true;
    }
    return false;
  }

  move(q, r, s) {
    // TODO: movement based on pathfinding and speed
  }
}
Character.CLASSES = [
  'bard',
  'cleric',
  'fighter',
  'monk',
  'rogue',
  'wizard',
];
Character.GENDERS = [
  'female',
  'male'
]
/**
 * Class representing a player character.
 */
class PC extends Character {
  /**
   * Create a new Player Character instance.
   */
  constructor(data) {
    super(data);

    /**
     * Singleton
     */
    if (PC._instance) {
      return PC._instance;
    }
    PC._instance = this;

    this._map = data.map;
    let _equip = JSON.parse(data.equipment);
    this._equipment = {
      weapon: _equip.weapon,
      alternate: _equip.alt,
      helmet: _equip.helmet,
      body: _equip.body,
      gloves: _equip.gloves,
      legs: _equip.legs,
      boots: _equip.boots,
    };
    this._inventory = new Inventory(INV_SLOTS);
    this._avatar = document.querySelector('div.hex-dash__avatar');
  }

  get avatar() {
    return this._avatar;
  }

  set class(text) {
    if (PC.CLASSES.includes(text.toLowerCase())) {
      this._class = text;
      return true;
    }
    return false;
  }

  static draw_class_select() {
    const multiply = Canvas.canvas.height / Canvas.images.bg_select.height;
    const width = Canvas.images.bg_select.width * multiply;
    Canvas.ctx.globalAlpha = 0.2;
    Canvas.ctx.drawImage(Canvas.images.bg_select, (Canvas.canvas.width - width) / 2, 0, width, Canvas.canvas.height);
    Canvas.ctx.globalAlpha = 1.0;

    Canvas.ctx.font = 'bold 16pt Sava';
    Canvas.ctx.textAlign = 'center';
    Canvas.ctx.textBaseline = 'middle';
    Canvas.ctx.fillStyle = 'rgba(217, 186, 120, 1)';
    
    if (Canvas.canvas.width > 360) {
      Canvas.ctx.fillText('Class Selection', Canvas.canvas.width / 2 + 20, Canvas.canvas.height / 2 - 100);
      Canvas.ctx.font = 'bold 16pt "Font Awesome 6 Sharp"';
      Canvas.ctx.strokeStyle = 'rgba(217, 186, 120, 1)';
      Canvas.ctx.fillText(String.fromCharCode(parseInt('f71d', 16)), Canvas.canvas.width / 2 - 76, Canvas.canvas.height / 2 - 102);

      Canvas.ctx.filter = 'grayscale(1)'
      Canvas.ctx.globalAlpha = 0.7;
      Canvas.ctx.drawImage(Canvas.images.bard_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE * 2 + 30), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.cleric_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.fighter_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.globalAlpha = 0.2;
      Canvas.ctx.drawImage(Canvas.images.monk_gray, (Canvas.canvas.width / 2) + (Canvas.AVATAR_SIZE + 30), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.rogue_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.globalAlpha = 0.7;
      Canvas.ctx.drawImage(Canvas.images.wizard_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.globalAlpha = 1.0;
      Canvas.ctx.filter = 'none';
    } else {
      Canvas.ctx.fillText('Class Selection', Canvas.canvas.width / 2 + 20, Canvas.canvas.height / 2 - 120);
      Canvas.ctx.font = 'bold 16pt "Font Awesome 6 Sharp"';
      Canvas.ctx.strokeStyle = 'rgba(217, 186, 120, 1)';
      Canvas.ctx.fillText(String.fromCharCode(parseInt('f71d', 16)), Canvas.canvas.width / 2 - 76, Canvas.canvas.height / 2 - 122);

      Canvas.ctx.drawImage(Canvas.images.bard_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.cleric_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.fighter_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.globalAlpha = 0.5;
      Canvas.ctx.drawImage(Canvas.images.monk_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.drawImage(Canvas.images.rogue_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
      Canvas.ctx.globalAlpha = 1.0;
      Canvas.ctx.drawImage(Canvas.images.wizard_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
    }

    Canvas.ctx.font = 'bold 12pt Sava';
    Canvas.ctx.textAlign = 'center';
    Canvas.ctx.textBaseline = 'middle';
    Canvas.ctx.fillStyle = 'rgba(77, 197, 220, 1)';

    if (Canvas.canvas.width > 360) {
      switch (Canvas.AVATAR) {
        case 0:
          break;
        case 1:
          Canvas.ctx.drawImage(Canvas.images.bard, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE * 2 + 30), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Bard', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          break;
        case 2:
          Canvas.ctx.drawImage(Canvas.images.cleric, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Cleric', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          break;
        case 3:
          Canvas.ctx.drawImage(Canvas.images.fighter, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Fighter', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          break;
        case 4:
          /*
          Canvas.ctx.drawImage(Canvas.images.monk, (Canvas.canvas.width / 2) + (Canvas.AVATAR_SIZE + 30), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Monk', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          */
          break;
        case 5:
          /*
          Canvas.ctx.drawImage(Canvas.images.rogue, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Rogue', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          */
          break;
        case 6:
          Canvas.ctx.drawImage(Canvas.images.wizard, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Wizard', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE * 2);
          break;
      }
    } else {
      switch (Canvas.AVATAR) {
        case 0:
          break;
        case 1:
          Canvas.ctx.drawImage(Canvas.images.bard, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Bard', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          break;
        case 2:
          Canvas.ctx.drawImage(Canvas.images.cleric, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Cleric', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          break;
        case 3:
          Canvas.ctx.drawImage(Canvas.images.fighter, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Fighter', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          break;
        case 4:
          /*
          Canvas.ctx.drawImage(Canvas.images.monk, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Monk', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          */
          break;
        case 5:
          /*
          Canvas.ctx.drawImage(Canvas.images.rogue, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Rogue', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          */
          break;
        case 6:
          Canvas.ctx.drawImage(Canvas.images.wizard, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
          Canvas.ctx.fillText('Wizard', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + 180);
          break;
      }
    }
  }

  static draw_gender_select() {
    const multiply = Canvas.canvas.height / Canvas.images.bg_select.height;
    const width = Canvas.images.bg_select.width * multiply;
    Canvas.ctx.globalAlpha = 0.2;
    Canvas.ctx.drawImage(Canvas.images.bg_select, (Canvas.canvas.width - width) / 2, 0, width, Canvas.canvas.height);
    Canvas.ctx.globalAlpha = 1.0;

    Canvas.ctx.font = 'bold 16pt Sava';
    Canvas.ctx.textAlign = 'center';
    Canvas.ctx.textBaseline = 'middle';
    Canvas.ctx.fillStyle = 'rgba(217, 186, 120, 1)';
    Canvas.ctx.fillText('Gender', Canvas.canvas.width / 2 + 12, Canvas.canvas.height / 2 - 100);
    Canvas.ctx.font = 'bold 16pt "Font Awesome 6 Sharp"';
    Canvas.ctx.strokeStyle = 'rgba(217, 186, 120, 1)';
    Canvas.ctx.fillText(String.fromCharCode(parseInt('f007', 16)), Canvas.canvas.width / 2 - 42, Canvas.canvas.height / 2 - 102);
  
    Canvas.ctx.drawImage(Canvas.images.venus_gray, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
    Canvas.ctx.drawImage(Canvas.images.mars_gray, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);

    Canvas.ctx.font = 'bold 12pt Sava';
    Canvas.ctx.textAlign = 'center';
    Canvas.ctx.textBaseline = 'middle';
    Canvas.ctx.fillStyle = 'rgba(77, 197, 220, 1)';

    switch (Canvas.AVATAR) {
      case 0:
        break;
      case 1:
        Canvas.ctx.drawImage(Canvas.images.venus, (Canvas.canvas.width / 2) - (Canvas.AVATAR_SIZE + 10), Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
        Canvas.ctx.fillText('Female', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE);
        break;
      case 2:
        Canvas.ctx.drawImage(Canvas.images.mars, (Canvas.canvas.width / 2) + 10, Canvas.canvas.height / 2 - Canvas.AVATAR_SIZE / 2, Canvas.AVATAR_SIZE, Canvas.AVATAR_SIZE);
        Canvas.ctx.fillText('Male', Canvas.canvas.width / 2, Canvas.canvas.height / 2 + Canvas.AVATAR_SIZE);
        break;
    }
  }
}

class NPC extends Character {
  constructor(data) {
    super(data);

    this.drops = new Inventory(NPC_NUM_DROPS);
  }

  set class(text) {
    if (Character.CLASSES.includes(text.toLowerCase())) {
      this.class = text;
      return true;
    }
    return false;
  }
}

export { PC, NPC };
export default PC;
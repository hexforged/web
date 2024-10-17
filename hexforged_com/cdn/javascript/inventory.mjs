/**
 *
 * $KYAULabs: inventory.mjs,v 1.0.0 2024/10/14 03:36:21 -0700 kyau Exp $
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

class Inventory {
  constructor(size) {
    this._size = size;
    this._items = new Array(size).fill(null);
  }

  // Method to add an item to the first available slot
  add_item(item, quantity) {
    const available_slot = this._items.indexOf(null);
    if (available_slot !== -1) {
      if (quantity <= 0) {
        throw new Error('Quantity should be greater than 0');
      }
      this._items[available_slot] = { item, quantity };
      return true; // Item added successfully
    } else {
      return false; // Inventory is full
    }
  }

  // Method to get an item from a specific slot
  get_item(slot) {
    if (slot >= 0 && slot < this._size) {
      return this._items[slot];
    } else {
      throw new Error('Invalid slot number');
    }
  }

  // Method to print inventory contents
  get_all() {
    return this._items.map((item, index) => ({
      slot: index,
      item: item || 'Empty'
    }));
  }

  // Method to set an item in a specific slot
  set_item(slot, item, quantity) {
    if (slot >= 0 && slot < this._size) {
      if (quantity <= 0) {
        throw new Error('Quantity should be greater than 0');
      }
      this._items[slot] = { item, quantity };
      return true;
    } else {
      throw new Error('Invalid slot number');
    }
  }

  // Method to remove an item from a specific slot
  remove_item(slot) {
    if (slot >= 0 && slot < this._size) {
      const removed_item = this._items[slot];
      this._items[slot] = null;
      return removed_item;
    } else {
      throw new Error('Invalid slot number');
    }
  }

  // Method to check how many slots are used
  get_used_slots() {
    return this._items.filter(item => item !== null).length;
  }

  // Method to check how many slots are free
  get_free_slots() {
    return this._size - this.get_used_slots();
  }

  // Method to get the total size of the inventory
  get_total_slots() {
    return this._size;
  }

  // Method to check if the inventory is full
  is_full() {
    return this.get_used_slots() === this._size;
  }

  // Method to check if the inventory is empty
  is_empty() {
    return this.get_used_slots() === 0;
  }

  // Method to increase the inventory size
  increase_size(extra_slots) {
    this._size += extra_slots;
    this._items.length = this._size; // Resize the items array
    for (let i = this.get_used_slots(); i < this._size; i++) {
      if (!this._items[i]) this._items[i] = null; // Initialize new slots with null
    }
  }
}

export { Inventory };
export default Inventory;
import Phaser from 'phaser';

class InventoryManager extends Phaser.Events.EventEmitter {
    /*
    Manages the use of resource inventory... 
        - loads all of the player's inventory
        - adds and removes items to the players inventory (called via Traditional Activity play)
        - Update inventory display (not dealt with yet. there will be an InventoryPopupScene that handles displaying of inventory objects.)
    */
    constructor(scene, initialInventory) {
        super();
        this.scene = scene; // Reference to the Phaser scene
        this.inventory = {}; // Stores inventory items as objects
        this.inventory = initialInventory || {}; // Stores inventory items as objects
        this.emit('inventoryLoaded', this.inventory);
        console.log(Object.keys(this.inventory).length);
    }

    
    /*
     Adds or updates the quantity of an resource in the inventory.
     Parameters:
        - itemId (string)- The ID of the resource to add (eg. "r1")
        - quantity (number) - The amount of the resource to add.
     */
    addItem(itemId, quantity) {
        if (this.inventory[itemId]) {
            this.inventory[itemId].quantity += quantity;
        } else {
            console.log(`Item ${itemId} not found in inventory.`);
        }
        this.emit('inventoryUpdated', this.inventory);
    }

    /*
    Removes a certain quantity of an item from the inventory.
        - itemId (string)- The ID of the resource to add (eg. "r1")
        - quantity (number) - The amount of the resource to remove.
    */
    removeItem(itemId, quantity) {
        if (this.inventory[itemId] && this.inventory[itemId].quantity >= quantity) {
            this.inventory[itemId].quantity -= quantity;
            if (this.inventory[itemId].quantity === 0) {
                delete this.inventory[itemId];
            }
            this.emit('inventoryUpdated', this.inventory);
        } else {
            console.log(`Not enough ${itemId} in inventory to remove or item not found.`);
        }
    }

    /*
    Returns the entire inventory object.
    returns {Object:Resource} The complete resource inventory object.
     */
    getInventory() {
        return this.inventory;
    }

    // In UIScene...
    create() {
        this.inventoryDisplay = this.add.text(10, 10, '', { font: '16px Courier', fill: '#ffffff' });
        this.scene.get('InventoryManager').events.on('inventoryUpdated', this.updateInventoryDisplay, this);
        //create close button. onclick: closeInventory() 
    }

    //...move to InventoryPopupScene
    updateInventoryDisplay(inventory) {
        let displayText = 'Inventory:\n';
        for (let item in inventory) {
            displayText += `${item}: ${inventory[item]}\n`;
        }
        this.inventoryDisplay.setText(displayText);
    }

    //probably unnecessary. there's a close button in PopupScene that the InventoryPopupScene will extend.
    closeInventory() {
        this.scene.stop('InventoryPopupScene');
        this.scene.resume(this.scene);
    }
}

export default InventoryManager; // Export a singleton instance: use shared inventory manager across the game

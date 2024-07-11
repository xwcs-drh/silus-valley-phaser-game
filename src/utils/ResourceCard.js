import Phaser from 'phaser';

//Constructed from InventoryPopupScene and ActivitiesLeftPage (via RecipeBookPopupScene)
export default class ResourceCard extends Phaser.GameObjects.Container {
    //takes in the scene its being constructed by, x and y positions of the resource card, card width and height, the object with the data of the resource, and the quantity to display on the card.
    constructor(scene, x, y, width, height, resource, quantity) {
        super(scene, x, y);
        this.cardWidth = width;
        this.cardHeight = height;
        this.cardX = x;
        this.cardY = y;
        this.resource = resource;
        this.quantity = quantity;
        // this.isUnlocked = isUnlocked;
        this.language = this.scene.game.playerDataManager.getUserLanguage();

        this.h3Style = this.textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '11px',
            fill: '#000',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio,
            wordWrap: { width: this.width*0.9, useAdvancedWrap: true } // Set word wrap width
        };

        this.createCard();
    }

    /*
    Construct the Resource Card elements: background image, text for the resource name, and quantity to display.
    */
    createCard() {
        console.log(this.width);
        const background = this.scene.add.rectangle(this.x, this.y, this.cardWidth, this.cardHeight, this.isUnlocked ? 0xffffff : 0x888888).setOrigin(0.5);
        // const thumbnail = this.scene.add.image(0, -20, card_background).setScale(0.5);
        const nameText = this.scene.add.text(this.x, this.y, this.resource[`name${this.language}`], this.h3Style).setOrigin(0.5,1);        
        const quantityText = this.scene.add.text(this.x, this.y + this.cardHeight * 0.2, `Qty: ${this.quantity}`, this.h3Style).setOrigin(0.5,0);

        // this.add([background, thumbnail, nameText, quantityText]);
        this.add([background, nameText, quantityText]);

        // if (!this.isUnlocked) {
        //     const lockIcon = this.scene.add.image(40, -40, 'lockIcon').setScale(0.5);
        //     this.add(lockIcon);
        // }

        // this.setSize(this.cardWidth, this.cardHeight);

        //This object will be set as interactive once there is a ResourceCardDetails class extending PopupScene to show more details about the resource
        // this.setInteractive();
        // this.on('pointerdown', () => this.showResourceDetails());

    }

    /*
    showResourceDetails() will be implemented once there is a ResourceCardDetails class extending PopupScene to show more details about the resource
    */
    // showResourceDetails() {
    //     this.scene.events.emit('showResourceDetails', this.resource);
    // }
}
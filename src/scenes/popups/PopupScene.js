import Phaser from 'phaser';

export default class PopupScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    create() {
        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Calculate popup dimensions (80% of game dimensions)
        const popupWidth = gameWidth * 0.8;
        const popupHeight = gameHeight * 0.8;

        // Calculate popup position (centered)
        const popupX = (gameWidth - popupWidth) / 2;
        const popupY = (gameHeight - popupHeight) / 2;

        // Add a background overlay for the entire game area
        const background = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 1) //(x,y,w,h,c,a)
          .setOrigin(0, 0)
          .setInteractive();

        // Create a container for the popup content
        this.popupContainer = this.add.container(popupX, popupY)
          .setSize(popupWidth, popupHeight);

        // Add a background for the popup container
        const popupBackground = this.add.rectangle(0, 0, popupWidth, popupHeight, 0xffffff)
          .setOrigin(0, 0)
          .setInteractive();
        this.popupContainer.add(popupBackground);

        // Close button
        const closeButton = this.add.text(popupWidth - 40, 10, 'X', { fontSize: '32px', fill: '#000' })
          .setInteractive()
          .on('pointerdown', () => this.closePopup());

        this.popupContainer.add(closeButton);

        // Close the popup when clicking outside of the popup area
        this.input.on('pointerdown', (pointer) => {
            if (!this.popupContainer.getBounds().contains(pointer.x, pointer.y)) {
                this.closePopup();
            }
        });
    }

    /*
    Adding items to the popup window
    Parameters: 
        - xPercent (number) = position that x will be in relation to the popup popup width
        - yPercent (number) = position that y will be in relation to the popup popup height
        - content (Str, presumably) = what will be displayed within the main popup content area
        - centerXAt (bool) = default false, but if the developer wants the content to be centered in the popup window, set to true
    */
    addContentToPopup(xPercent, yPercent, content, centerXAt = false) {
        const popupWidth = this.popupContainer.width;
        const popupHeight = this.popupContainer.height;
        let contentX = popupWidth * xPercent;
        const contentY = popupHeight * yPercent;

        if (centerXAt) {
            contentX -= content.width / 2;
        }

        content.setPosition(contentX, contentY);
        this.popupContainer.add(content);
    }

    addPopupHeaderCenter(content){
        //deal with me
    }

    /*
    Called when the user clicks on the "x" in the top right corner, or outside the bounds of the popup window, to close the popup window, ie end the scene
    */
    closePopup() {
        this.scene.stop(this.scene.key);
    }
}
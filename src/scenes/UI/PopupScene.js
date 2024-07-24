import Phaser from 'phaser';

export default class PopupScene extends Phaser.Scene {
    constructor(key) {
        super(key);
        this.sceneKey = key;
        this.popupDepth = 121;
    }

    init(data={}) {
        console.log("BaseScene init data: ", data);        
        this.dataManager = this.game.dataManager;
        this.playerDataManager = this.game.playerDataManager;
        console.log(this.playerDataManager.getUserLanguage());
    }

    preload() {
        // Load common images for all popup scenes
        this.loadCommonImages();
    }

    loadCommonImages() {
        // Check if images are already loaded to avoid duplication
        if (!this.textures.exists('recipe_book_background')) {
            this.load.image('recipe_book_background', './assets/UI/recipe_book_background.png');
        }
        if (!this.textures.exists('blueButtonBackground')) {
            this.load.image('blueButtonBackground', './assets/UI/blank_blue_button.jpeg');
        }
        if (!this.textures.exists('lockIcon')) {
            this.load.image('lockIcon', '../assets/UI/lock_icon.jpeg');
        }
        if (!this.textures.exists('darkblue_wash_background')) {
            this.load.image('darkblue_wash_background', '../assets/UI/darkblue_wash_background.jpg');
        }
        if (!this.textures.exists('yellow_wash_background')) {
            this.load.image('yellow_wash_background', './assets/UI/yellow_wash_background.jpg');
        }

        // Load activity thumbnails
        const activities = this.dataManager.getAllTraditionalActivities();
        activities.forEach(activity => {
            const filepath = `./assets/UI/${activity.thumbnailFilename}`;
            if (!this.textures.exists(activity.thumbnailFilename)) {
                this.load.image(activity.thumbnailFilename, filepath);
            }
        });

        // Load resource images
        const resources = this.dataManager.getAllResources();
        resources.forEach(resource => {
            const filepath = `./assets/Images/vocabulary/${resource.imageFilename}`;
            if (!this.textures.exists(resource.imageFilename)) {
                this.load.image(resource.imageFilename, filepath);
                console.log(resource.imageFilename);
            }
        });
    }

    create() {
        console.log("background key", this.backgroundKey);
        this.blockerDepth = 120;
        // this.blocker = this.createBlocker();

        const gameWidth = this.sys.game.config.width;
        const gameHeight = this.sys.game.config.height;

        // Calculate popup dimensions (80% of game dimensions)
        const popupWidth = gameWidth * 0.8;
        const popupHeight = gameHeight * 0.8;

        // Calculate popup position (centered)
        const popupX = (gameWidth - popupWidth) / 2;
        const popupY = (gameHeight - popupHeight) / 2;

        // Add a background overlay for the entire game area
        // const background = this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 1) //(x,y,w,h,c,a)
          // .setOrigin(0, 0)
          // .setInteractive();

        // Create a container for the popup content
        this.popupContainer = this.add.container(popupX, popupY)
          .setSize(popupWidth, popupHeight);

        // Add a background for the popup container
        
        const popupBackground = this.add.image(popupWidth / 2, popupHeight / 2, this.backgroundKey)
            .setDisplaySize(popupWidth, popupHeight)
            .setOrigin(0.5, 0.5) // Center the background within the popup container
            .setDepth(119)
            .setInteractive();

        this.popupContainer.add(popupBackground);


        // Close button
        const closeButton = this.add.text(popupWidth - 40, 10, 'X', { fontSize: '32px', fill: '#000' })
            .setInteractive()
            .on('pointerdown', () => this.closePopup())
            .setDepth(119);
        

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
  
    /*
    May potentially be used for additional popup windows, 
        Like when the player has accessed their inventory, then resource details popup
            Would prevent player from interacting with inventory window while looking at a resource detail
    */
    createBlocker() {
        if (!this.blocker) {
            this.blocker = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0);
            this.blocker.setOrigin(0, 0);
            this.blocker.setInteractive();
            this.blocker.setDepth(this.blockerDepth); // Ensure the blocker is above the overlay
        } else {
            this.blocker.setVisible(true);
        }
        return this.blocker;
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
import Phaser from 'phaser';

export default class RoundedButton extends Phaser.GameObjects.Container {
    /*
    This button is currently only being used by MainMenuUI for the navigation buttons. 
    Is exported because it will probably be used in different UI menus
    */
    constructor(scene, x, y, width, height, imageKey, isVisible, callback) {
        super(scene, x, y);
        // console.log('image key: ', imageKey);

        // Create the image (to become button background)
        const buttonBackground = scene.add.image(0, 0, imageKey);
        buttonBackground.setDisplaySize(width, height); // Adjust image size to fit within the button

        //update button width to correspond to image dimensions
        const buttonWidth = buttonBackground.displayWidth;
        const buttonHeight = buttonBackground.displayHeight;
        
        // create a border around the button
        let border = this.createBorder(scene, buttonWidth, buttonHeight);
        border.lineStyle(5, 353535, 1); // Set line thickness, color, and alpha
        border.strokeRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
        // border.setDepth(100); // Set a lower depth;

        // Add border and image to the container. 
        //!!Make sure to do this before setting interactivity
        this.add(buttonBackground);
        this.add(border);

        // console.log(`Rounded Button ${imageKey} - callback: ${callback}`);
        
        // Make the button interactive, and set visibility based on constructor value
        this.setSize(buttonWidth, buttonHeight);
        this.setInteractive(new Phaser.Geom.Rectangle(0,0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', callback)            
            .on('pointerover', () => buttonBackground.setTint(0xAAAAAA))
            .on('pointerout', () => buttonBackground.clearTint())
            .setVisible(isVisible);

        // Add the button to the scene
        scene.add.existing(this);
        // console.log("rounded button- button added to scene: ",this);
    }

    /*
    Create the border for the button using graphics()
    */
    createBorder(scene, buttonWidth, buttonHeight){
        // Draw a border around the scene
        let graphics = scene.add.graphics();
        graphics.lineStyle(2, 0x000000, 1); // Set line thickness to 2, color to black, and alpha to full
        graphics.strokeRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
        return graphics;
    }
}
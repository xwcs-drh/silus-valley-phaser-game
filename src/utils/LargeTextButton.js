import Phaser from 'phaser';

export default class LargeTextButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, callback, width=190, height=50) {
    super(scene, Math.floor(x), Math.floor(y));
    
    const textStyle = {
        fontFamily: 'Unbounded',
        fontSize: '20px',
        fill: '#fff',
        strokeThickness:0.5,
        resolution: window.devicePixelRatio
    };

    // Load the background image
    const buttonBackground = scene.add.image(0, 0, 'blueButtonBackground').setOrigin(0.5);
    buttonBackground.setDisplaySize(width, height);

    //update button width to correspond to image dimensions
    const buttonWidth = buttonBackground.displayWidth;
    const buttonHeight = buttonBackground.displayHeight;
    
    // Create the text object
    const buttonText = scene.add.text(0, 0, text, textStyle).setOrigin(0.5);

    // Add background and text to the container
    this.add(buttonBackground);
    this.add(buttonText);

    // Make the button interactive
    this.setSize(buttonWidth, buttonHeight);
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => buttonBackground.setTint(0xAAAAAA))
      .on('pointerout', () => buttonBackground.clearTint());

    // Add the button object to the scene
    scene.add.existing(this);
  }
}
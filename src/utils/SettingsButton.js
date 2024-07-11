import Phaser from 'phaser';

//this is used in the RecipeBookPopupScene, left page.
export default class SettingsButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, callback, width=60, height=40) {
    super(scene, Math.floor(x), Math.floor(y));
    
    const textStyle = {
        fontFamily: 'Unbounded',
        fontSize: '14px',
        fill: '#fff',
        strokeThickness:0.5,
        resolution: window.devicePixelRatio
    };

    //add image preloaded in RecipeBookPopupScene
    const buttonBackground = scene.add.image(0, 0, 'blueButtonBackground')
      .setOrigin(0.5);
    buttonBackground.setDisplaySize(width, height);

  
    // Create the text object
    const buttonText = scene.add.text(0, 0, text, textStyle)
      .setOrigin(0.5);

    // Add background and text to the container
    this.add(buttonBackground);
    this.add(buttonText);

    // set the size and width to dimensions in the constructor
      //Make the button interactive
    this.setSize(width, height);

    this.setInteractive(new Phaser.Geom.Rectangle(0,0, width, height), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => buttonBackground.setTint(0xAAAAAA))
      .on('pointerout', () => buttonBackground.clearTint());

    // Add the button object to the scene
    scene.add.existing(this);

  }
}
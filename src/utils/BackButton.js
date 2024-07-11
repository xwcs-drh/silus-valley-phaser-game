import Phaser from 'phaser';

export default class BackButton extends Phaser.GameObjects.Container {
  constructor(scene, canvasWidth, canvasHeight, text, sceneManager) {
    const x = canvasWidth*0.15;
    const y = canvasHeight*0.1;
    super(scene, x, y);

    const textStyle = {
        fontFamily: 'Unbounded',
        fontSize: '20px',
        fill: '#fff',
        strokeThickness:0.5,
        resolution: window.devicePixelRatio
    };
    const width = canvasWidth*0.5;
    const height = canvasHeight*0.3;

    console.log("back button: x: ", x, " y: ", y);
    // Load the background image
    const buttonBackground = scene.add.image(x, y, 'blueButtonBackground').setOrigin(0.5);
    buttonBackground.setDisplaySize(width, height);
    
    //update button width to correspond to image dimensions
    const buttonWidth = buttonBackground.displayWidth;
    const buttonHeight = buttonBackground.displayHeight;

    // Create the text object
    const buttonText = scene.add.text(x, y, text, textStyle).setOrigin(0.5);

    // Add background and text to the container
    this.add(buttonBackground);
    this.add(buttonText);

    // Make the button interactive
    this.setSize(buttonWidth, buttonHeight);
    this.setInteractive(new Phaser.Geom.Rectangle(x, y, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown',  () => sceneManager.goBack())
      .on('pointerover', () => buttonBackground.setTint(0xAAAAAA))
      .on('pointerout', () => buttonBackground.clearTint());

    // Add the button object to the scene
  }
}
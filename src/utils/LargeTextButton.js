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

    // Log to see if the background is correctly added
    // console.log("Button background added:", buttonBackground);

    //update button width to correspond to image dimensions
    const buttonWidth = buttonBackground.displayWidth;
    const buttonHeight = buttonBackground.displayHeight;
    
    // Create the text object
    const buttonText = scene.add.text(0, 0, text, textStyle).setOrigin(0.5);

    // Log to see if the text is correctly added
    // console.log("Button text added:", buttonText);

    // Add background and text to the container
    this.add(buttonBackground);
    this.add(buttonText);

    // Make the button interactive
    this.setSize(buttonWidth, buttonHeight);
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => {
        // console.log('Pointer over');
        buttonBackground.setTint(0xAAAAAA);
      })
      .on('pointerout', () => {
        // console.log('Pointer out');
        buttonBackground.clearTint();
      });

    // Add the button object to the scene
    scene.add.existing(this);

    // Log the final state of the button
    // console.log("LargeTextButton created:", this);
  }
}
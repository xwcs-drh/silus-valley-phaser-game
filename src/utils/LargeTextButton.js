import FontStyles from '../assets/fonts/FontStyles';

export default class LargeTextButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, callback, width = 190, height = 50) {
    super(scene, Math.floor(x), Math.floor(y));

    const fontStyles = new FontStyles(scene);
    
    // const textStyle = {
    //     fontFamily: 'Unbounded',
    //     fontSize: `${Math.min(width, height) * 0.4}px`,
    //     fill: '#fff',
    //     strokeThickness: 0.5,
    //     resolution: window.devicePixelRatio
    // };

    // console.log("Width:", width);
    // console.log("Height:", height);
    const buttonBackground = scene.add.image(0, 0, 'blueButtonBackground').setOrigin(0.5);
    buttonBackground.setDisplaySize(width, height);

    // const buttonText = scene.add.text(0, 0, text, textStyle).setOrigin(0.5);
    const buttonText = scene.add.text(0, 0, text, this.scene.game.baseSceneGenericStyles.buttonFontStyle)
      .setOrigin(0.5);

    this.add(buttonBackground);
    this.add(buttonText);

    this.setSize(buttonBackground.displayWidth, buttonBackground.displayHeight);
    this.setPosition(x, y);

    // Debugging statements
    // console.log("Button position:", this.x, this.y);
    // console.log("Button size:", this.width, this.height);
    // console.log("Interactive area:", -width / 2, -height / 2, width, height);

    // Correct the interactive area to match the button's dimensions
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', callback)
      .on('pointerover', () => {
        buttonBackground.setTint(0xAAAAAA);
      })
      .on('pointerout', () => {
        buttonBackground.clearTint();
      });

    scene.add.existing(this);
  }
}
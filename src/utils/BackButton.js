export default class BackButton extends Phaser.GameObjects.Container {
  constructor(scene, canvasWidth, canvasHeight, sceneManager) {
    super(scene, canvasWidth, canvasHeight);
    
    // console.log('Initializing BackButton');
    
    // Store the scene manager for later use
    this.sceneManager = sceneManager;

    // Calculate button position and size based on canvas dimensions
    const x = canvasWidth * 0.07;
    const y = canvasHeight * 0.05;
    const width = canvasWidth * 0.095;
    const height = width * 0.35;

    // console.log(`Button position: (${x}, ${y}), size: (${width}, ${height})`);

    // Add the button background image
    const buttonBackground = scene.add.image(0, 0, 'backButtonImg').setOrigin(0.5);
    buttonBackground.setDisplaySize(width, height);


    // Add the button background to the container
    this.add(buttonBackground);

    // Set the size of the container to match the button background
    this.setSize(buttonBackground.displayWidth, buttonBackground.displayHeight);

    // Set the position of the container
    this.setPosition(x, y);

    // Make the button interactive and define its interactive area
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonBackground.displayWidth, buttonBackground.displayHeight), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        console.log('Back button pressed');
        sceneManager.goBack();
      })
      .on('pointerover', () => {
        // console.log('Pointer over back button');
        buttonBackground.setTint(0xAAAAAA);
      })
      .on('pointerout', () => {
        // console.log('Pointer out of back button');
        buttonBackground.clearTint();
      });

    // Add the container to the scene
    scene.add.existing(this);
    // console.log('BackButton added to scene');

    // Log the final position of the button
    // console.log(`Final button position: (${this.x}, ${this.y})`);
  }
}
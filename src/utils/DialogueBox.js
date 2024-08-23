import Phaser from 'phaser';
import FontStyles from '../assets/fonts/FontStyles';

export default class DialogueBox extends Phaser.GameObjects.Container {
  constructor(scene, dialogueManager, x, y, callback, width = 590, height = 100, boxRadius = 20, buttonRadius = 10) {
    super(scene, Math.floor(x), Math.floor(y));
    // console.log('DialogueBox constructor called');
    //console.log('Scene:', scene);

    // Ensure the scene is valid before proceeding
    // if (!scene || !scene.sys) {
    //   console.error('Invalid scene object passed to DialogueBox');
    //   return;
    // }
    this.callback = callback;
    this.scene = scene;
    this.dialogueManager = dialogueManager;
    this.width = this.scene.canvasWidth*0.65;
    this.height = this.scene.canvasHeight*0.18;
    this.buttonDiameter = this.width*0.05;
    this.buttonRadius = this.buttonDiameter*0.1;

    const textStyle = {
      fontFamily: 'Unbounded',
      fontSize: `${Math.min(this.width, this.height) * 0.18}px`,
      fill: '#000',
      strokeThickness: 0.5,
      resolution: window.devicePixelRatio,
      wordWrap: { width: this.width *0.9, useAdvancedWrap: true } // Set word wrap width
    };

    // Create the background and border
    const background = this.createBackgroundAndBorder(scene, this.width, this.height, boxRadius);

    // Create the dialogue text object
    this.dialogueText = scene.add.text(0, 0, "", {...this.scene.game.baseSceneGenericStyles.dialogueFontStyle, wordWrap: { width: this.width *0.9, useAdvancedWrap: true }}).setOrigin(0.5);

    // Calculate the button position relative to the dialogue box
    const buttonOffsetX = this.width / 2 - 10;  // Adjust the button's X position relative to the right edge
    const nextButtonOffsetY = this.height / 2 - 10;  // Adjust the button's Y position relative to the bottom edge
    const skipButtonOffsetY = -(this.height / 2 - 10);  // Adjust the button's Y position relative to the bottom edge

    //Create the "go" (to next line of dialogue) button
    this.nextButton = this.createButton(scene, buttonOffsetX, nextButtonOffsetY, '\u25B6', this.nextLine.bind(this));
    this.nextButton.setVisible(false);

    //Create the "skip" (to next line of dialogue) button
    this.skipButton = this.createButton(scene, buttonOffsetX, skipButtonOffsetY, '\u23ED', this.skipDialogue.bind(this));
    this.skipButton.setVisible(false);

    // Add background, text, and progression button to the container
    this.add(background);
    this.add(this.dialogueText);
    this.add(this.nextButton);
    this.add(this.skipButton);

    // Make the container size match the background size
    this.setSize(width, height);

    // Add the container to the scene
    scene.add.existing(this);
  }

  /*
  Create the button that will progress lines of dialogue
  Parameters:
  - scene (scene) the button is being displayed in
  - x (Number) : X position for the button
  - y (Number) : Y position for the button
  - text (string): text to be displayed within the button
  - callback (function): function to be called when the button is clicked
  */
  createButton(scene, x, y, text, callback) {
    console.log('Creating button x:', x, 'y:', y, 'text:', text);
    // Create the button graphics object and set position
    const buttonGraphics = this.createButtonGraphics(scene, this.buttonDiameter, this.buttonDiameter, this.buttonRadius, 0xffffff)
      .setPosition(x,y);

    // Create the button text
    const buttonText = this.scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: `${Math.min(this.width, this.height) * 0.18}px`,
      color: '#000'
    }).setOrigin(0.5);
    
    // Create an invisible rectangle for the button's interactive area
    const buttonRect = this.scene.add.rectangle(x, y, this.buttonDiameter, this.buttonDiameter)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', callback)
      .on('pointerover', () => this.changeButtonColor(buttonGraphics, 0xE4E4E4))
      .on('pointerout', () => this.changeButtonColor(buttonGraphics, 0xffffff));

    // Group the button components in a container
    const buttonContainer = this.scene.add.container(0, 0, [buttonGraphics, buttonText, buttonRect]);

    // Store references for later 
    buttonContainer.buttonGraphics = buttonGraphics;
    buttonContainer.buttonRect = buttonRect;

    return buttonContainer;
  }

  /*
  Create the button background and border for the button
  Parameters:
  - scene (scene) the button is being displayed in
  - width (Number) : width of the button
  - height (Number) : height of the button
  - radius (Number): radius of the button corners
  - color (string): 0xffffff color to set the button background as
  */
  createButtonGraphics(scene, width, height, radius, color) {
    const buttonGraphics = scene.add.graphics();
    buttonGraphics.fillStyle(color, 1);  // Fill color for active state
    buttonGraphics.lineStyle(2, 0x000000, 1);  // Line color and alpha
    buttonGraphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    buttonGraphics.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    return buttonGraphics;
  }

  /*
  Create the button background and border for the dialogue box
  Parameters:
  - scene (scene) the dialogue box is being displayed in
  - width (Number) : width of the box
  - height (Number) : height of the box
  - radius (Number): radius of the box corners
  */
  createBackgroundAndBorder(scene, width, height, radius) {
    // Create the background graphics object
    const backgroundGraphics = this.scene.add.graphics();
    backgroundGraphics.fillStyle(0xffffff, 1);  // Fill color and alpha
    backgroundGraphics.lineStyle(2, 0x000000, 1);  // Line color and alpha

    // Draw the rounded rectangle
    backgroundGraphics.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    backgroundGraphics.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

    return backgroundGraphics;
  }

  /*
  Called when the button is clicked
    Disables button and changes background color
    runs callback - DialogueManager.processNextEntry()
    After 2 seconds: Enables button and changes background back
  */
  nextLine() {
    if(this.button){ //if the button exists
      // Disable the button's input
      // console.log('Button clicked. Setting inactive button state.');
      // Change button to inactive color
      this.changeButtonColor(this.button.buttonGraphics, 0xe4e4e4);
      this.setButtonVisibility(false);
      this.button.buttonRect.disableInteractive();
    }
    // Execute the callback function before making the button inactive
    // console.log('Executing callback.');
    this.callback(this.scene);
    
    if(this.nextButton){ //if the button exists
      // Reactivate the button after 2 seconds
      this.scene.time.delayedCall(2000, () => {
        console.log('Reactivating button after delay.');
        
          this.changeButtonColor(this.nextButton.buttonGraphics, 0xffffff);
          // this.setButtonVisibility(true);
          this.nextButton.buttonRect.setInteractive();

      });
    }
  }

  /*
  Called when the Skip Dialogue button is clicked
    Disables button and changes background color
    runs callback - DialogueManager.processNextEntry()
    After 2 seconds: Enables button and changes background back
  */
    skipDialogue() {
      console.log('Skipping dialogue');
      this.dialogueManager.terminateDialogue();
    }

  /*
  Change background color, maintains border color
  Must clear existing graphics, create new graphics with different color
  */
  changeButtonColor(buttonGraphics, color) {
    const {x, y} = buttonGraphics //get the current button position
    buttonGraphics.clear();
    buttonGraphics.fillStyle(color, 1);  // Fill color and alpha
    buttonGraphics.lineStyle(2, 0x000000, 1);  // Line color and alpha
    buttonGraphics.fillRoundedRect(-this.buttonDiameter / 2, -this.buttonDiameter / 2, this.buttonDiameter, this.buttonDiameter, this.buttonRadius);
    buttonGraphics.strokeRoundedRect(-this.buttonDiameter / 2, -this.buttonDiameter / 2, this.buttonDiameter, this.buttonDiameter, this.buttonRadius);
    buttonGraphics.setPosition(x, y); // Restore the position after redrawing
  }

  /*
  Change the text in dialogue box 
  Called by DialogueManager.processNextEntry()
  */
  setText(newText) {
    if (this.dialogueText) {
      this.setButtonVisibility(false);
      this.dialogueText.setText(newText);
      this.scene.time.delayedCall(2000, () => {
        this.setButtonVisibility(true);
      });
    }
  }

  /*
  Change visibility of the 'go' button
  */
  setButtonVisibility(visible) {
    if (this.nextButton) {
      this.nextButton.setVisible(visible);
    }
    if (this.skipButton) {
      this.skipButton.setVisible(visible);
    }
  }

  /*
  Method to destroy the dialogue box
  Remove the box and set to null (such that no box is detected)
  */
  destroyBox() {
    // Destroy all children (background and text) first
    this.removeAll(true);
    // Destroy the container itself
    this.destroy();
  }
  /*
  Method to destroy the button
  Remove the button and set to null (such that no button is detected)
  */
  destroyButtons() {
    // Destroy all children (background and text) first
    this.nextButton.removeAll(true);
    this.skipButton.removeAll(true);
    // Destroy the container itself
    this.nextButton.destroy();
    this.skipButton.destroy();
    this.nextButton = null;
    this.skipButton = null;
  }
}
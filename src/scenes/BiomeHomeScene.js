import BaseScene from './BaseScene';
// import BackButton from '../utils/BackButton';
// console.log("OpeningIntroductionScene defined: ", BaseScene); // Check if BaseScene is defined
import DialogueManager from '../managers/DialogueManager';
// console.log("OpeningIntroductionScene defined: ", DialogueManager); // Check if BaseScene is defined

export default class BiomeHomeScene extends BaseScene {
    constructor() {
        super({ key: 'BiomeHomeScene' });
        //console.log("BiomeHomeScene: constructor called");
    }

    init(data) {
        this.reference = data.reference;
        //console.log("BiomeHomeScene: init called with data: ", data); // Debugging output
        super.init(data);
        // this.dialogue = data.allDialogue
    }

    preload() {
        super.preload();
        //console.log('BiomeHomeScene: preload');
        this.load.image('workbench', './assets/UI/workbench.jpeg'); // Load backyard image
        this.load.image('signpost', './assets/UI/signpost.jpg'); // Load backyard image
    }

    create() {
        // this.game.global.currentBiomeID = this.game.global.allBiomesData.find(b => 
                // b.biome_reference_name === this.reference).id;

        super.create(); //set up base scene's background and border
        this.dataManager.setCurrentBiome(this.reference);

        this.createActionLandmarks();
        console.log(`Current Biome : ${this.dataManager.getCurrentBiome()}`);
    }

    /*
    Creates buttons for:
        the signpost to access vocabulary minigames base scene
        the workbench to access traditional activities base scene
    */
    createActionLandmarks(){
        //create signpost button... will replace with interactive sprite probably
        this.workbenchButton = this.createLandmarkButton(this.canvasWidth*0.2,this.canvasHeight*0.7, "workbench", "TraditionalActivitiesMenuScene", this.biomeReference);
        //create workbench button... will replace with interactive sprite probably
        const vocabMinigame = this.dataManager.getVocabularyMinigame("g3");
        // this.signpostButton = this.createLandmarkButton(this.canvasWidth*0.7,this.canvasHeight*0.7, "signpost", "VocabWheelMinigameScene", {vocabMinigame});
        this.signpostButton = this.createLandmarkButton(this.canvasWidth*0.7,this.canvasHeight*0.7, "signpost", "VocabMinigamesMenuScene",this.biomeReference);
    }

    /*
    Create a Landmark button
    Parameters
        - x (Number) = x position of center of button
        - y (Number) = y position of center of button
        - image (string) = name of the image object that will be set as the background of the button
        - scene_constructor_identifier (string) = string corresponding to the name of the scene related to the landmark activity (e.g. traditionalActivitiesBaseScene or vocabBaseScene)
        - biomeReference (string) = string corresponding to the reference_name of the biome scene as indicated in Scenes.json (e.g. river or littleForest)
    */
    createLandmarkButton(x, y, image, scene_constructor_identifier, biomeReference) {
        const textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '20px',
            fill: '#fff',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio
        };

        const regionWidth = this.gameWidth * 0.2;
        const regionHeight = this.gameHeight * 0.2;

        // Create a container for the button
        const buttonContainer = this.add.container(x, y);

        // Load the background image
        const regionBackground = this.add.image(0, 0, image).setOrigin(0.5);
        regionBackground.setDisplaySize(regionWidth, regionHeight);

        // Update button width to correspond to image dimensions
        const buttonWidth = regionBackground.displayWidth;
        const buttonHeight = regionBackground.displayHeight;

        // Add background and text to the container
        buttonContainer.add(regionBackground);

        // Make the button interactive
        buttonContainer.setSize(buttonWidth, buttonHeight);
        buttonContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains)
          .on('pointerdown', () => {
              console.log(`Button pressed for scene: ${scene_constructor_identifier}`);
              this.game.sceneManager.changeScene(scene_constructor_identifier, biomeReference);
          })
          .on('pointerover', () => regionBackground.setTint(0xAAAAAA))
          .on('pointerout', () => regionBackground.clearTint());

        return buttonContainer;
    }

}

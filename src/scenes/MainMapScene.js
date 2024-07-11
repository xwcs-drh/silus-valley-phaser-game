import BaseScene from './BaseScene';
import DialogueManager from '../managers/DialogueManager';

export default class MainMapScene extends BaseScene {
    /*
    This is the second scene the player will see
        runs when they click the "Start" button in the StartMenuScene
    MainUIScene will not run in parallel with this, to avoid cognitive overload for the player
        and to not mess with the display of popups or create redundant buttons
    */
    constructor() {
        super('MainMapScene');
        // console.log("MainMapScene: constructor called");
    }

    /*
    Prepare data and initializes in the extended scene (BaseScene)
        - all scene data... this probably isnt necessary to be passed in, since it's global??
        - all dialogue data... have to think about this
    */
    init(data) {
        // console.log("MainMapScene: init called with data: ", data); // Debugging output
        this.dialogue = data.allDialogue //may have to manage this differently??
        super.init(data); //initialize BaseScene with data passed into scene on start, in this case it only contains `allScenesData`.
    }

    //run BaseScene preload
    preload() {
        super.preload(); //run BaseScene preload()
        // console.log('MainMapScene: preload');
        this.load.image('house_backyard', './assets/UI/house_backyard.jpeg'); // Load backyard image
        this.load.image('river', './assets/UI/river.jpeg'); // Load backyard image

    }

    /*
    Run create() in BaseScene
    Create variables for 
        - sceneKey (str)
        - currentDialogueIndex (number)... may move to dialogue manager
    Create a return button to go back to start scene (may modify to employ a navigation manager)
    Create dialogue assistant (dialogueManager)
    */
    create() {
        // Accessing the scene's key 
        this.sceneKey = this.sys.settings.key;
        // console.log('Scene key is:', this.sceneKey);
        super.create(); //run BaseScene create()

        this.createBiomeRegions();
        console.log("start mainui scene hopefully");
        // this.sceneManager.updateUIScene(this, 'MainUIScene');
    }

    update(time, delta) {
        //potentially use for dialogue function... not sure yet
    }

    /*
    Create buttons for biome regions that the player can select.
    !!TODO: Block interactivity to start. create function and associate it to the last line of dialogue.
    */
    createBiomeRegions(){
        //create little forest area button... will replace with interactive sprite probably
        this.littleForest_area = this.createSceneButton(this.canvasWidth*0.2,this.canvasHeight*0.7, "house_backyard", "littleForest")
        this.littleForest_area.setName('littleForest_area'); //set name to be recognize as object when searched as function argument
        //Verify that the object can be found by name
        const foundObject = this.children.getByName('littleForest_area');
        if (foundObject) {
            console.log('Object found:', foundObject);
        } else {
            console.error('Object not found with name littleForest_area');
        }

        //create river area... will replace with interactive sprite probably
        this.river_area = this.createSceneButton(this.canvasWidth*0.7,this.canvasHeight*0.7, "river", "river")//create river area
        this.river_area.setName('river_area'); //set name to be recognize as object when searched as function argument
        // foundObject = this.children.getByName('river_area');
        // if (foundObject) {
        //     console.log('Object found:', foundObject);
        // } else {
        //     console.error('Object not found with name river_area');
        // }

        // console.log(`start menu scene : littleForest_area button ${typeof this.littleForest_area}`);
    }

    /*
    Create Scene buttons
    Parameters
        - x (Number) = x position of center of button
        - y (Number) = y position of center of button
        - image (string) = name of the image object that will be set as the background of the button
        - biomeReference (string) = string corresponding to the reference_name of the biome scene as indicated in Scenes.json
    */
    createSceneButton(x, y, image, biomeReference) {
        const textStyle = {
            fontFamily: 'Unbounded',
            fontSize: '20px',
            fill: '#fff',
            strokeThickness: 0.5,
            resolution: window.devicePixelRatio
        };

        const regionWidth = this.gameWidth * 0.4;
        const regionHeight = this.gameHeight * 0.4;

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
              this.startBiomeScene(biomeReference);
          })
          .on('pointerover', () => regionBackground.setTint(0xAAAAAA))
          .on('pointerout', () => regionBackground.clearTint());

        return buttonContainer;
    }

    startBiomeScene(biomeReference) {
        console.log(`MainUI - Starting BiomeHomeScene with referenceName: ${biomeReference}`);
        console.log("MainUI - is sceneManager", this.game.sceneManager);

        this.game.sceneManager.changeScene("BiomeHomeScene", biomeReference);
    }
}

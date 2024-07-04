import BaseScene from './BaseScene';
import BackButton from '../utils/BackButton';
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
        //Set SceneData array object locally within this scene
        this.allScenesData = data.allScenesData;
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
        super.create(); //run BaseScene create()

        // Accessing the scene's key 
        this.sceneKey = this.sys.settings.key;
        // console.log('Scene key is:', this.sceneKey);

        //sets index to 0, start of scene dialogue
        //? should this go in dialogue manager?
        this.currentDialogueIndex = 0;

        //hides dialogue at start
        this.isDialogueBoxActive = false;

        //Create map button that will be called at the end of dialogue.
        this.createReturnButton();

        //initiate DialogueManager to run the dialogue for the scene
        this.createDialogueAssistant();

        this.createBiomeRegions();
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
        //create river area... will replace with interactive sprite probably
        this.river_area = this.createSceneButton(this.canvasWidth*0.7,this.canvasHeight*0.7, "river", "river")//create river area
        
        console.log(`start menu scene : littleForest_area button ${typeof this.littleForest_area}`);

    }

    //go back to start scene. will have to make dynamic to use across all scenes.
    //integrate into scenemanager/navigationManager/ MainUIScene
    createReturnButton(){
        console.log('MainMapScene: createReturnButton');
        const buttonText = "<-";
        const buttonX = this.canvasWidth*0.2;
        const buttonY = this.canvasHeight*0.2;

        const backButton = new BackButton(this, buttonX, buttonY, buttonText,() => {
            console.log(buttonText,' button clicked');

            //start or launch indicated scene
            this.scene.start('OpeningIntroductionScene', { allScenesData: this.allScenesData});
        });
        backButton.setDepth(5);
    }

    /*
    Create Scene buttons
    Parameters
        - x (Number) = x position of center of button
        - y (Number) = y position of center of button
        - popupToLaunch (string) = name of the popup scene that should be launched on button click
    !Replace with images.
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
              this.sceneManager.changeScene("BiomeHomeScene", biomeReference);
          })
          .on('pointerover', () => regionBackground.setTint(0xAAAAAA))
          .on('pointerout', () => regionBackground.clearTint());

        return buttonContainer;
    }

    /*
    DIALOGUE
    This creates an instance of a DialogueManager. 
    I have not made the dialogue manager (successfully) yet... written the script but not tested.
    */
    createDialogueAssistant(){
        console.log(this.highlightService ? "highlight service exists" : "highlight service not found");
        const allDialogueData = this.registry.get('allDialogueData'); // Retrieve from registry
        // console.log("All Dialogue Data: ", allDialogueData);
        this.dialogueManager = new DialogueManager(this, allDialogueData);
        this.dialogueManager.initDialogue();
        this.dialogueManager.create();
        // console.log("OpeningIntroductionScene: Dialogue Manager created: ", this.dialogueManager ? "true" : "false");
    }

}

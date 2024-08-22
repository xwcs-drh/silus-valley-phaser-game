import Phaser from 'phaser';
import ArrowService from '../utils/ArrowService';
import HighlightService from '../utils/HighlightService';

// import MainUI from './MainUI'; // Import MainUI (the default export) from MainUI.js
export default class BaseScene extends Phaser.Scene {
    /*
    Many scenes extend this scene. 
    It creates:
        - Background for the scene, based on key of scene that extends it cross-referenced with the SceneObject associated with the sceneKey or reference (scene.reference_name)
        - Border for the game window
        - Launches the UI scene that corresponds to the scene object (scene.UIMenu)
        - Creates variables that can later be referenced for: game window width, height canvas window, height, resolution, and DPI
    Note: Depth should be set on every element in BaseScene to 0, or < 0, to prevent the elements in the extending class from being obstructed
    */
    constructor(key) {
        super(key);
        this.sceneKey = key;
        // console.log("BaseScene: constructor called with key: ", this.sceneKey);
    }

    /*
    Prepare data from extending scene
        - all scene data... this probably isnt necessary to be passed in, since it's global??
        - reference: secondary identifier for the scene, for when the scene content loads dynamically
        - selects the Scene Object pertinent to the content that should be displayed... in BaseScene specifically to load the correct background
    */
    init(data={}) {
        // console.log("BaseScene init data: ", data);
        // console.log("BaseScene init reference: ", data.reference);
        
        this.reference = data.reference ? data.reference : this.sceneKey;
        this.dataManager = this.game.dataManager;
        // console.log(`BaseScene: Data manager? ${this.dataManager}`);
        const allScenesData = this.dataManager.getAllScenesData();

        this.sceneManager = this.game.sceneManager;
        // console.log(this.sceneManager); 
        this.currentSceneData = this.sceneManager.getCurrentSceneData();
        // console.log("Base Scene: current scene data " , this.currentSceneData);
        // this.currentSceneData = this.allScenesData.find(scene => scene.reference_name === this.reference);
        // if (!this.currentSceneData) {
        //     // console.error('No sceneData received in BaseScene.');
        //     return;
        // }
        // console.log(`BaseScene: ui manager? ${this.game.UIManager}`);
        this.UIManager = this.game.UIManager;
    }

    /*
    Preload background image for scene based on relevant Scene object

    Note: every scene must have a background image filename listed in Scenes.json, and that image must be (correctly named) in src/assets/UI/
    */
    preload() {
        // console.log("BaseScene: preloading with sceneData: ", this.sceneData);
        // Background_image is defined in the sceneData for each scene
        // console.log('current scene data: ', this.currentSceneData.background_image);
        // console.log('scene background: ', this.game.sceneManager.getSceneBackground());
        const imagePath = `./assets/UI/${this.game.sceneManager.getSceneBackground()}`;
        // console.log(`Base Scene background image path: ${imagePath}`);
        this.load.image('arrowImage', './assets/UI/arrow.png'); // Load arrow texture
        //console.log('scene background image name: ', this.currentSceneData.background_image);
        // console.log('background image path: ', imagePath);
        if (this.currentSceneData && imagePath) {
            this.load.image(this.game.sceneManager.getSceneBackground(), imagePath);
        }
    }

    /*
    Creates variables that can later be referenced for: 
        - game window width, 
        - game window height
        - canvas window width
        - canvas window height
        - game resolution
        - DPI of the device being used
    Launches the proper UI scene according to the current SceneData (so they run in parallel)
    */
    create() {
        // console.log('BaseScene: create called');
        this.createBackground(); //Create window border, and scene background if a background image is indicated in scenesData.
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;
        // Get Phaser resolution setting
        this.gameResolution = this.sys.game.config.resolution;
        // Get device pixel ratio
        this.devicePixelRatio = window.devicePixelRatio;
        // console.log("Base scene current scene data: ",this.currentSceneData);
        
        console.log("base scene - update ui", this.currentSceneData.UIMenu);
        // this.scene.launch(this.currentSceneData.UIMenu);
        this.sceneManager.updateUIScene(this.scene, this.currentSceneData.UIMenu);
        // this.launchUI();
        //Create the arrow service in scene
        this.arrowService = new ArrowService(this);
        this.arrowService.createArrow('arrowImage', 0xff0000); //(sprite, fill color)
        // console.log(`OpeningIntroductionScene: arrow service: ${this.arrowService}`);

        //Create the highlight service in scene
        this.highlightService = new HighlightService(this);
        // console.log(`OpeningIntroductionScene: highlight service: ${this.highlightService}`);

        // Delay the call to runDialogueAssistant to ensure extending scene's create() is complete
        this.time.delayedCall(0, () => {
            this.runDialogueAssistant();
        });    

        // Add event listener for window resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Initial call to handleResize to set up elements correctly
        this.handleResize();

    }

     // Method to handle window resize
    handleResize() {
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;
        this.gameResolution = this.sys.game.config.resolution;
        this.devicePixelRatio = window.devicePixelRatio;

        // Recursively update resolution of all image and text elements
        this.updateResolution(this.children.list);
    }

    // Recursive method to update resolution of all text elements
    updateResolution(children) {
        children.forEach(child => {
            if (child instanceof Phaser.GameObjects.Text) {
                if (child.setResolution) {
                    child.setResolution(this.devicePixelRatio);
                }
            } else if (child.list) {
                // If the child has its own children (e.g., a container), recursively update them
                this.updateResolution(child.list);
            }
        });
    }

    /*
    Set background to fill the game window, centered, with a border
    */
    createBackground(){
        //Add a background image if one is indicated in the sceneData object
        console.log("current scene data: ", this.currentSceneData);
        if (this.currentSceneData && this.sceneManager.getSceneBackground()) {        
            // Add the background image at the scene's center
            let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.currentSceneData.background_image);
            console.log("bg: ", bg);
        
            // Scale the image to cover the whole game area
            bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            bg.setDepth(-10);
            // console.log(`Debug background depth: ${bg.depth}`);
        }

        // Draw a border around the scene
        let graphics = this.add.graphics();
        graphics.lineStyle(5, 353535, 1); // Set line thickness, color, and alpha
        graphics.strokeRect(0, 0, this.cameras.main.width, this.cameras.main.height)
        graphics.setDepth(0); // Set a lower depth;
        
    }

    /*
    Sets dialogueManager variable in this scene
    Calls for the dialogue to begin being displayed
    */
    runDialogueAssistant(){
        // console.log(" base scene: run dialogue assistant");
        this.dialogueManager = this.game.dialogueManager;
        // console.log(" base scene: scene reference", this.reference);
        this.dialogueManager.startSceneDialogue(this, this.reference);
    }
}
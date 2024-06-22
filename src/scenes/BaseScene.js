import Phaser from 'phaser';

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
        this.allScenesData = data.allScenesData || this.registry.get('allScenesData');
        this.reference = data.reference ? data.reference : this.sceneKey;

        // console.log("BaseScene- referenceName: ", this.reference);

        this.currentSceneData = data.allScenesData.find(scene => scene.reference_name === this.reference);
        if (!this.currentSceneData) {
            // console.error('No sceneData received in BaseScene.');
            return;
        }
        // console.log("BaseScene: current scene data: ", this.currentSceneData);
    }

    /*
    Preload background image for scene based on relevant Scene object

    Note: every scene must have a background image filename listed in Scenes.json, and that image must be (correctly named) in src/assets/UI/
    */
    preload() {
        // console.log("BaseScene: preloading with sceneData: ", this.sceneData);
        // Background_image is defined in the sceneData for each scene
        // console.log('current scene data: ', this.currentSceneData.background_image);
        const imagePath = `./assets/Images/${this.currentSceneData.background_image}`;

        //console.log('scene background image name: ', this.currentSceneData.background_image);
        // console.log('background image path: ', imagePath);

        if (this.currentSceneData && this.currentSceneData.background_image) {
            this.load.image(this.currentSceneData.background_image, imagePath);
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

        //Launch UI Scene associated with the current Scene object to run in parallel... if no UI referenced in the Scene object, 
        if (this.currentSceneData.UIMenu && this.currentSceneData.UIMenu != "") {
            //only launch a new UI menu if that UI menu isn't already running.
            if (!this.scene.isActive(this.currentSceneData.UIMenu)) {
                this.scene.launch(this.currentSceneData.UIMenu);
            }
        } else {
            //only stop MainUIScene if it was already running before the query began
                //assumes theres only 1 possible UI menu, because right now there is. 
                //will have to add other UI scenes as they are created
            if (this.scene.isActive("MainUIScene")) { 
                this.scene.stop("MainUIScene");
            }
        }
    }

    /*
    Set background to fill the game window, centered, with a border
    */
    createBackground(){
        //Add a background image if one is indicated in the sceneData object
        if (this.currentSceneData && this.currentSceneData.background_image) {        
            // Add the background image at the scene's center
            let bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, this.currentSceneData.background_image);
        
            // Scale the image to cover the whole game area
            bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            bg.setDepth(0);
            // console.log(`Debug background depth: ${bg.depth}`);
        }

        // Draw a border around the scene
        let graphics = this.add.graphics();
        graphics.lineStyle(5, 353535, 1); // Set line thickness, color, and alpha
        graphics.strokeRect(0, 0, this.cameras.main.width, this.cameras.main.height)
        graphics.setDepth(0); // Set a lower depth;
        
    }
}
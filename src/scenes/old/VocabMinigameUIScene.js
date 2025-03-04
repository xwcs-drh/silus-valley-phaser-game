import Phaser from 'phaser';
import RoundedButton from '../../utils/RoundedButton';
import BackButton from '../../utils/BackButton';

export default class VocabMinigameUIScene extends Phaser.Scene {
    constructor(scene) {
        super({ key: 'VocabMinigameUIScene' });
        this.scene = scene;
        this.defaultDepth = 110; //so that elements of the UI scene appear in front of the elements of the scene running in parallel
        
        //reference containers for loaded biome icons and navigation buttons
        this.loadedBiomeIcons = {};
        this.biomeNavButtons = {};
        console.log('MainUIScene - constructed');

    }

    init(data) {
        console.log('MainUIScene - init called');
    }

    /**
     * Updates the current scene reference
     * @param {Scene} scene - The new scene to reference
     */
    setScene(scene){
        console.log("updating current scene reference");
        this.scene = scene;
    }

    /**
     * Loads the main button icons
     */
    preload() {
        //preload main button icons
        // this.load.image('navigationToggleButtonImg', './assets/UI/globe.jpeg');
        // this.load.image('inventoryToggleButtonImg', './assets/UI/basket.jpeg');
        // this.load.image('settingsToggleButtonImg', './assets/UI/cog-icon.jpeg');
        // this.load.image('recipeBookToggleButtonImg', './assets/UI/recipe_book.jpeg');
        this.load.image('backButtonImg', './assets/UI/back.png');

        //preload biome navigation buttons
        this.loadBiomeIcons();
    }

    //To have elements appear in front of scene running in parallel
    setDefaultDepthForAllChildren() {
        this.children.each(child => {
            child.setDepth(this.defaultDepth);
        });
    }

    /**
     * Creates the main UI scene
     */
    create() {
        console.log('MainUIScene - create called');
        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;
        this.mainSceneKey = this.getPrimarySceneKey(); // Set mainSceneKey here
        this.dataManager = this.game.dataManager; // Get the DataManager instance


        //set width of all buttons
        this.iconWidth = this.canvasWidth * 0.05;
        this.iconGap = this.canvasWidth * 0.015;
        // const testText = this.add.text(this.sys.game.config.width/2, 10, 'UI', { fontSize: '48px', fill: '#000' });
        // testText.setDepth(this.defaultDepth + 1);

        //Create UI buttons -- will have to alter positioning to accommodate dynamic device size
        // this.biomeNagivationButton = this.addButton(this.canvasWidth*0.95, this.canvasHeight*0.9, 'navigationToggleButtonImg', true, this.toggleBiomeNavigationButtons); //create button to toggle biome buttons
        // this.addBiomesButtons(); //create individual biome nagivation buttons dynamically from biome data
        // this.updateBiomeNavButtonInteractivity();
        // console.log("MainUIScene - navigation button exists: ", this.biomeNagivationButton.name);
        //Add settings button. 
        // this.settingsToggleButton = this.addButton(this.canvasWidth*0.65, this.canvasHeight*0.9, 'settingsToggleButtonImg', true, () => this.game.sceneManager.showPopupScene(this.scene, 'SettingsPopupScene')); //create button to show settings popup window via UIManager
        
        //Add inventory button
        // this.inventoryToggleButton = this.addButton(this.canvasWidth*0.75, this.canvasHeight*0.9, 'inventoryToggleButtonImg', true, () => this.game.sceneManager.showPopupScene(this.scene, 'InventoryPopupScene')); //create button to show inventory popup window via UIManager
        
        //Add recipe book button
        // this.recipeBookToggleButton = this.addButton(this.canvasWidth*0.85, this.canvasHeight*0.9, 'recipeBookToggleButtonImg', true, () => this.game.sceneManager.showPopupScene(this.scene, 'RecipeBookPopupScene')); //create button to show recipe book popup window via UIManager
        
        //Add back button.
        this.createReturnButton();

        this.setDefaultDepthForAllChildren(); //make sure every element in this scene has a higher depth, so that it appears in front of the scene its running in parallel with
        
    }

    /*
    Get the key of the primary scene that MainUIScene is running in parallel with
    */
    getPrimarySceneKey() {
        // Access the list of all active scenes
        const runningScenes = this.scene.manager.getScenes(true);
        // console.log('MainUIScene: Running scenes:', runningScenes.map(scene => scene.sys.settings.key));

        // Filter to find the current active scene that is not this scene
        const mainScene = runningScenes.find(scene => scene.sys.settings.key !== 'MainUIScene' && scene.sys.settings.status === Phaser.Scenes.RUNNING);
        let mainSceneKey = ""; // Use let instead of const
        if (mainScene) {
          mainSceneKey = mainScene.sys.settings.key;
        //   console.log(`MainUIScene: Found mainSceneKey: ${mainSceneKey}`);
        } else {
        //   console.error('MainUIScene: Could not find the main scene key');
        }
        return mainSceneKey;
    }


    /*
    Loading biome data information and populating biome icon image arrays
    Parameters: none
    Assumes: allBiomesData is accessable as a global variable, declared in BootScene.js
    */
    loadBiomeIcons(){
        //get biome data from dataManager
        this.biomesData = this.game.dataManager.getAllBiomesData();
        // console.log("MainUIScene - biomes data: ", this.biomesData);

        this.biomesData.forEach(biome => {
            if (biome.unlocked === "true") { // Only preload biome icon if the player has access to the biome
                const filePath = `../assets/UI/${biome.icon_filename}`;
                // console.log(`Loading icon for biome: ${biome.nameE} filepath: ${filePath}`);
                this.load.image(biome.id, filePath);
                this.loadedBiomeIcons[biome.id] = biome.id;
            } 
        });
    }

    /*
    Adding custom buttons to mainUI using the RoundedButton class
    Parameters: 
        - x (num) = x position
        - y (num) = y position
        - img (str) = variable key for button icon image file
        - visible (bool) = whether to set the button to visible or not on create 
        - callback (function) = function to be called on pointerdown event
    Assumes: all buttons are the same width and height (iconW)
    */
    addButton(x, y, img, isVisible, callback){
        const boundCallback = callback.bind(this);
        this.button = new RoundedButton(
            this,
            x, y, 
            this.iconWidth, this.iconWidth,
            img,
            isVisible, 
            boundCallback
        );
        this.button.setDepth(this.defaultDepth);
        // console.log(`Debug button depth: ${this.button.depth}`);
    }

    /*
    Adding biome navigation buttons to mainUI
    Parameters: None
        - Uses global variable `biomeNavButtons` and `loadedBiomeIcons` arrays
    Behavior: Add a button for each biome, whose callback is a function to launch that biome scene.
    */
    addBiomesButtons(){
        const nUnlockedBiomes = this.game.dataManager.getNumberUnlockedBiomes();
        console.log(`Number of unlocked biomes: ${nUnlockedBiomes}`);

        const startX = this.getBiomeStartX(nUnlockedBiomes);
        let x = startX + (this.iconWidth / 2);
        const buttonY = this.canvasHeight * 0.8;
        const gapWidth = this.canvasWidth * 0.015;
        //TODO: add condition for if width of icons at default size overflow


        this.biomesData.forEach(biome => {
            if(biome.unlocked === "true"){ //if the player can access the biome, make button
                //set button name, e.g. littleForestNavigationButton
                let buttonName = `${biome.biome_reference_name}NavigationButton`;
    
                // console.log("MainUIScene- biomesData", this.biomesData);
                // console.log("MainUIScene- biome.icon filename: ", this.loadedBiomeIcons[biome.id]);
                let targetBiome = this.biomesData.find(r => r.id === biome.id);
                // console.log("MainUIScene- targetBiome: ", targetBiome);
                let biomeReference = targetBiome.biome_reference_name;
                //store biome navigation button in array, where the button key is the button name. 
                
                let newButton = this.createBiomeButton(x,buttonY,biome,biome.id, biomeReference)
                
                this.biomeNavButtons[buttonName] = newButton;

                x += (gapWidth + this.iconWidth); // set the x position for the next biome button
                // console.log("MainUIScene - Biome button created: ", this.biomeNavButtons[buttonName], " ; x: ", this.biomeNavButtons[buttonName].x , " ; y: ", this.biomeNavButtons[buttonName].y);
            } else {
                // console.log("MainUIScene - Biome button not created: ", biome);
            }
        });
        // console.log("MainUI - biomeNavButtons: ", this.biomeNavButtons);
    }

    
    createBiomeButton(x,y,biome,biomeID, biomeReference){

        const button = new RoundedButton(
            this,
            x, y, 
            this.iconWidth, this.iconWidth,
            this.loadedBiomeIcons[biome.id], 
            false, 
            () => this.startBiomeScene(biomeReference)
        );
        // Set the depth for the new button
        button.setDepth(this.defaultDepth);
        // console.log(`Debug button depth: ${this.button.depth}`);
        // Store the button in the array
        return button;
    }
    /*
    Calculates the right edge X value of all the biome icons
    Parameters: nBiomeButtons (Num) = number unlocked biomes
    */
    getBiomeStartX(nBiomeButtons){
        const totalIconsWidth = (this.iconGap*(nBiomeButtons-1)) + (this.iconWidth * (nBiomeButtons-0.5));
        // console.log(totalIconsWidth);
        const iconsRightEdge = this.canvasWidth * 0.95;
        // console.log(iconsRightEdge);
        const startX = iconsRightEdge - totalIconsWidth;
        // console.log(startX);
        return startX;
    }

    recalculateBiomeStartX(){
        //enter logic to recalculate the dimensions of the buttons to account for the width
    }

    /*
    Displays/hides all biome navigation buttons

    Parameters: None
    Behavior: For each biome navigation button, hides if they are visible, otherwise displays
    Function calls: toggleBiomeNavigationButtons() > showHideButton(button) > isButtonVisible(button)
    */
    toggleBiomeNavigationButtons() {
        // console.log("MainUI - toggling biome navigationbuttons");
        for (let key in this.biomeNavButtons) {
            if(this.biomeNavButtons.hasOwnProperty(key)){
                const button = this.biomeNavButtons[key];
                this.showHideButton(button);
            }
        }
    }

    /*
    Display or hide a button

    Parameters: 
        - button (str) = button identifier
    Behavior: hides the button if it is visible, displays the button if it is not visible
    */
    showHideButton(button){
        let visible = button.visible;;
        // console.log(`MainUI button ${button} visible? ${visible}`);
        button.setVisible(!visible);
    }

    /*
    Switching to biome scene

    Parameters: 
        - biome (str) = scene constructor identifier / biome.nameE (these should be equal strings)
    */
    startBiomeScene(biomeReference) {
        console.log(`MainUI - Starting BiomeHomeScene with referenceName: ${biomeReference}`);
        // console.log("MainUI - is sceneManager", this.game.sceneManager);
        this.game.sceneManager.changeScene("BiomeHomeScene", biomeReference);
        this.updateBiomeNavButtonInteractivity();
    }

    /**
     * Updates the interactivity of the biome navigation buttons
     */
    updateBiomeNavButtonInteractivity() {

        const currentBiomeReference = this.dataManager.getCurrentBiomeReference();
        console.log("MainUIScene: Current biome reference:", currentBiomeReference);

        for (const biomeId in this.biomeNavButtons) {
            if (this.mainSceneKey === "BiomeHomeScene" && biomeId === this.game.global.currentBiomeId) {
                this.biomeNavButtons[biomeId].disableInteractive();
                console.log("MainUIScene : ", this.biomeNavButtons[biomeId]);
            } else {
                this.biomeNavButtons[biomeId].setInteractive();
            }
        }
    }

    /**
     * Creates the return button
     */
    createReturnButton(){
        //create the back button
        const backButton = new BackButton(this, this.canvasWidth, this.canvasHeight, this.game.sceneManager);
        // console.log("back button: ", backButton);
        backButton.setDepth(this.defaultDepth+1);
    }
}

import Phaser from 'phaser';

// import NavigationManager from '../managers/NavigationManager';
import InventoryManager from '../managers/InventoryManager';
import RoundedButton from '../utils/RoundedButton';

export default class MainUI extends Phaser.Scene {
    constructor() {
        super('MainUIScene');
        this.defaultDepth = 100; //so that elements of the UI scene appear in front of the elements of the scene running in parallel

        //set width of all buttons
        this.buttonW = 30; 

        //reference containers for loaded biome icons and navigation buttons
        this.loadedBiomeIcons = {};
        this.biomeNavButtons = {};
    }

    preload() {
        //preload main button icons
        this.load.image('navigationToggleButtonImg', './assets/UI/globe.jpeg');
        this.load.image('inventoryToggleButtonImg', './assets/UI/basket.jpeg');
        this.load.image('settingsToggleButtonImg', './assets/UI/cog-icon.jpeg');
        this.load.image('recipeBookToggleButtonImg', './assets/UI/recipe_book.jpeg');
        this.load.image('backButtonImg', './assets/UI/back.png');

        //preload biome navigation buttons
        this.loadBiomeData();
    }

    //To have elements appear in front of scene running in parallel
    setDefaultDepthForAllChildren() {
        this.children.each(child => {
            child.setDepth(this.defaultDepth);
        });
    }

    create() {
        // console.log('MainUIScene - create called');

        this.windowWidth = this.sys.game.config.width;
        this.windowHeight = this.sys.game.config.height;
        this.iconWidth = this.windowWidth * 0.06
        const testText = this.add.text(this.sys.game.config.width/2, 10, 'UI', { fontSize: '48px', fill: '#000' });
        testText.setDepth(this.defaultDepth + 1);

        //Create UI buttons -- will have to alter positioning to accommodate dynamic device size
        this.biomeNagivationButton = this.addButton(this.windowWidth*0.8, this.windowHeight*0.9, 'navigationToggleButtonImg', true, this.toggleBiomeNavigationButtons); //create button to toggle biome buttons
        this.addBiomesButtons(); //create individual biome nagivation buttons dynamically from biome data
        // this.settingsToggleButton = this.addButton(450, 400, 'settingsToggleButtonImg', true, this.toggleWindow('SettingsPopupScene')); //create button to show settings popup window
        // this.inventoryToggleButton = this.addButton(500, 400, 'inventoryToggleButtonImg', true, this.toggleWindow('InventoryPopupScene')); //create button to show inventory popup window 
        // this.recipeBookToggleButton = this.addButton(550, 400, 'recipeBookToggleButtonImg', true, this.toggleWindow('RecipeBookPopupScene')); //create button to show recipe book popup window
        // this.backButton = this.addButton(50,50, 'backButtonImg', true, this.goBack.bind(this)); //add a back button
        
        this.setDefaultDepthForAllChildren(); //make sure every element in this scene has a higher depth, so that it appears in front of the scene its running in parallel with
    }

    /*
    Loading biome data information and populating biome icon image arrays
    Parameters: none
    Assumes: allBiomesData is accessable as a global variable, declared in BootScene.js
    */
    loadBiomeData(){
        this.biomesData = this.game.global.allBiomesData;
        // console.log("MainUIScene - biomes data: ", this.biomesData);

        if (!this.biomesData) {
            // console.error("MainUIScene - biomes data not found.");
            return;
        }

        // console.log("MainUIScene- biomes data: ", this.biomesData);
        
        //load icons for all unlocked biomes
        this.loadBiomeIcons();
    }

    loadBiomeIcons(){
        this.biomesData = this.game.global.allBiomesData;

        this.biomesData.forEach(biome => {
            if (biome.unlocked === "true") { // Only preload biome icon if the player has access to the biome
                const filePath = `../assets/UI/${biome.icon_filename}`;
                console.log(`Loading icon for biome: ${biome.nameE} filepath: ${filePath}`);
                this.load.image(biome.id, filePath);
                this.loadedBiomeIcons[biome.id] = biome.id;
            } 
        });
        // console.log('loadedBiomeIcons: ', this.loadedBiomeIcons);
    }

    /*
    Adding custom buttons to mainUI using the RoundedButton class
    Parameters: 
        - x (num) = x position
        - y (num) = y position
        - img (str) = variable key for button icon image file
        - visible (bool) = whether to set the button to visible or not on create 
        - callback (function) = function to be called on pointerdown event
    Assumes: all buttons are the same width and height (buttonW)
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
        const nBiomeButtons = Object.keys(this.loadedBiomeIcons).length;
        var y = this.windowHeight * 0.8; //assume all buttons will be aligned horizontally
        const gapWidth = this.windowWidth * 0.015;

        const nUnlockedBiomes = this.biomesData.filter(biome => biome.unlocked === "true").length;
        // console.log(`Number of unlocked biomes: ${nUnlockedBiomes}`);

        var startX = this.getBiomeStartX(nUnlockedBiomes); //add condition for if width of icons at default size overflow
        // console.log("MainUIScene- startX: ", startX);
        let x = startX + (this.iconWidth / 2);
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
                
                let newButton = this.createBiomeButton(x,y,biome,biome.id, biomeReference)
                
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

        this.button = new RoundedButton(
            this,
            x, y, 
            this.iconWidth, this.iconWidth,
            this.loadedBiomeIcons[biome.id], 
            false, 
            () => this.startBiomeScene(biomeReference)
        );
        // Set the depth for the new button
        this.button.setDepth(this.defaultDepth);
        // console.log(`Debug button depth: ${this.button.depth}`);
        // Store the button in the array
        return this.button;
    }
    /*
    Calculates the right edge X value of all the biome icons
    Parameters: nBiomeButtons (Num) = number unlocked biomes
    */
    getBiomeStartX(nBiomeButtons){
        const gameWidth = this.sys.game.config.width; //width of game window
        const biomeDivWidth = gameWidth * 0.3; //widest span of biome icons will be 30% the width of the game window
        const biomeDivLeftGap = gameWidth * 0.15;
        const leftXBiomeDiv = gameWidth - biomeDivWidth - biomeDivLeftGap; //the left edge of the biome icon div will allow for a 15% gap on the right side
        const gapWidth = gameWidth * 0.25;
        const defaultIconWidth = 0.05;

        const spanXBiomeIcons = (nBiomeButtons*defaultIconWidth) + ((nBiomeButtons-1)*gapWidth);
        const startXInDiv = (biomeDivWidth - spanXBiomeIcons) / 2;
        const startXinGame = startXInDiv + leftXBiomeDiv;

        return startXinGame;
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
    Display or hide a popup window (special scene)

    Parameters: 
        - className (str) = scene construction identifier
    Behavior: displays a popup window
        > toggleWindow(SettingsScene) : will display settings scene popup window
        > toggleWindow(InventoryManager) : will display inventoryManager popup window
    */
    toggleWindow(className) {
        this.scene.launch(scene); //I may need to add a key parameter here
        this.scene.pause(gameScene); //passed in when UI scene is launched in scene create
    }


    /*
    Switching to biome scene

    Parameters: 
        - biome (str) = scene constructor identifier / biome.nameE (these should be equal strings)
    */
    startBiomeScene(biomeReference) {
        console.log(`MainUI - Starting BiomeHomeScene with referenceName: ${biomeReference}`);
        console.log("MainUI - is sceneManager", this.game.sceneManager);
        this.game.sceneManager.changeScene("BiomeHomeScene", biomeReference);
    }
}


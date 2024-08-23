import Phaser from 'phaser';
import PlayerDataManager from '../managers/PlayerDataManager';
import DataManager from '../managers/DataManager';
// import UIManager from '../managers/UIManager';
import SceneManager from '../managers/SceneManager';
import * as UIScenes from './UI/UIScenes'; // Import all UI scenes from UIScenes.js
import UserSettingsManager from '../managers/UserSettingsManager';
import DialogueManager from '../managers/DialogueManager';
import FontStyles from '../assets/fonts/FontStyles'

export default class BootScene extends Phaser.Scene {
    /*
    This scene runs first!
    */
    constructor() {
        super({key: 'BootScene'});
        console.log('Bootscene: constructor');
        this.fontsLoaded = false;
        this.managersLoaded = false;
    }

    preload() {
        console.log('Bootscene: preload');
        
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.fontStyles = new FontStyles(this);
        this.fontStyles.load();

        //Preload and cache JSON data files
        this.load.json('allScenesData', './assets/data/JSONs/Scenes.json');
        this.load.json('allDialogueData', './assets/data/JSONs/Dialogue.json');
        this.load.json('allBiomesData', './assets/data/JSONs/Biomes.json');
        this.load.json('allResourcesData', './assets/data/JSONs/Resources.json');
        this.load.json('allTraditionalActivitiesData', './assets/data/JSONs/tempTraditionalActivities.json');
        this.load.json('allVocabularyMinigameData', './assets/data/JSONs/VocabMinigames.json');
        this.load.json('playerData', './assets/data/JSONs/PlayerData.json'); // Load player data for testing
        this.load.json('allVocabularyData', './assets/data/JSONs/Vocabulary.json');
        
         // Listen for the 'fonts-loaded' event
         this.events.on('fonts-loaded', () => {
            this.fontsLoaded = true;
            // console.log('Fonts loaded:', this.fontsLoaded, this.game.global.baseSceneGenericStyles); // Check if global styles are set
            this.game.baseSceneGenericStyles = this.game.global.baseSceneGenericStyles;
            // console.log('Fonts saved:', this.fontsLoaded, this.game.baseSceneGenericStyles); // Check if global styles are set
            this.checkIfReady();
        });

        window.addEventListener('resize', () => {
            this.fontStyles.updateFontResolution();
            this.updateTextElementsResolution();
        });
    }

    create() {
        // Adjust canvas size
        const { width, height } = this.sys.game.canvas;
        this.sys.game.config.width = width;
        this.sys.game.config.height = height;
        this.scale.resize(width, height);

        // Store canvas dimensions for easy access
        this.canvasWidth = width;
        this.canvasHeight = height;

        console.log('boot scene: create');
        // Initialize global state
        this.game.global = {
            currentBiomeID: null,
            currentSceneKey: null,    
            settings: {},
        };

        //Initialize DataManager object and store it in the global object.; load json data for Biomes, Scenes,Resources and TraditionalActivities
        this.loadDataManager();

        //Initialize PlayerDataManager and store it in the global object. ; load data from PlayerData.json
        //move to localstorage after testing
        this.loadPlayerDataManager();

        //Initialize UserSettingsManager and store it in the global object.
        this.loadUserSettingsManager();
        
        // Initialize UIManager and SceneManager
        this.initializeManagers();

        //Initialize DialogueManager and store it in the global object.
        // this.loadDialogueManager();

        //Initialize the scene manager
        // this.game.sceneManager = new SceneManager(this.game, this.game.dataManager, "BootScene");

        this.managersLoaded = true;
        this.checkIfReady();
        

        // this.game.scene.launch("MainUIScene");
        //Initialize UIManager and register scenes
        // this.initializeUI();
        // Set up a resize listener

    }
    
    //Start the Main User scene - contains "Start" button, and "Credits", "Manual", "Settings" buttons.
    checkIfReady() {
        if (this.fontsLoaded && this.managersLoaded) {
            // console.log('Fonts loaded:', this.game.baseSceneGenericStyles);
            this.game.sceneManager.changeScene('StartMenuScene');
        }
    }

    updateTextElementsResolution() {
        // Iterate through all scenes and update text elements' resolution
        this.scene.manager.scenes.forEach(scene => {
            scene.children.list.forEach(child => {
                if (child instanceof Phaser.GameObjects.Text) {
                    const fontFamily = child.style.fontFamily.split(',')[0].trim(); // Extract the primary font family
                    const style = this.game.baseSceneGenericStyles.headerFontStyle; // Use a default style for simplicity
                    if (style) {
                        child.setStyle({ resolution: style.resolution });
                    } else {
                        console.warn(`Font family ${fontFamily} not found in global styles`);
                    }
                }
            });
        });
    }

    /*
    Loads JSON data into Data Manager.
    JSON data preloaded in BootScene.preload();
    Data:
        - Scenes.json : data related to scenes and scene variants
        - Biomes.json : data related to biomes
        - Resources.json : data related to all resources set in the game
        - TraditionalActivities.json : data related to all traditional activities available in the game
    */
    loadDataManager(){
        //Initialize DataManager and store it in the global object.
        this.game.dataManager = new DataManager();
        console.log(this.game.dataManager);
        this.game.dataManager.setAllScenesData(this.cache.json.get('allScenesData'));
        this.game.dataManager.setAllBiomesData(this.cache.json.get('allBiomesData'));
        this.game.dataManager.setAllResourcesData(this.cache.json.get('allResourcesData')); 
        this.game.dataManager.setAllTraditionalActivitiesData(this.cache.json.get('allTraditionalActivitiesData')); 
        this.game.dataManager.setAllDialogueData(this.cache.json.get('allDialogueData')); 
        this.game.dataManager.setAllVocabularyMinigameData(this.cache.json.get('allVocabularyMinigameData')); 
        this.game.dataManager.setAllVocabularyData(this.cache.json.get('allVocabularyData')); 
    }

    //Declare PlayerDataManager - manages variables related to a specific player's status
    loadPlayerDataManager() {
        this.game.playerDataManager = new PlayerDataManager(this.game.dataManager);
        const playerData = this.cache.json.get('playerData');
        this.game.playerDataManager.loadPlayerData(playerData);
        console.log(this.game.playerDataManager.getSettings());
    }

    /*
    Creates UserSettingsManager and loads the user's settings
    */
    loadUserSettingsManager(){
        this.game.userSettingsManager = new UserSettingsManager();
        this.game.userSettingsManager.loadSettings(this.game.playerDataManager);
    }

    initializeManagers() {
        // this.game.UIManager = new UIManager(this.game);
        this.game.sceneManager = new SceneManager(this, this.game, this.game.dataManager);

        // Set dependencies
        // this.game.UIManager.setSceneManager(this.game.sceneManager);
        // this.game.sceneManager.setUIManager(this.game.UIManager);

        // Register and launch UI scenes
        this.game.sceneManager.registerAndLaunchUIScenes(UIScenes);

        this.loadDialogueManager();
    }

    loadDialogueManager(){
        this.game.dialogueManager = new DialogueManager(this.game, this.game.dataManager);
    }

}
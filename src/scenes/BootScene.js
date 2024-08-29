import Phaser from 'phaser';
import PlayerDataManager from '../managers/PlayerDataManager';
import DataManager from '../managers/DataManager';
// import UIManager from '../managers/UIManager';
import SceneManager from '../managers/SceneManager';
import * as UIScenes from './UI/UIScenes'; // Import all UI scenes from UIScenes.js
import UserSettingsManager from '../managers/UserSettingsManager';
import DialogueManager from '../managers/DialogueManager';

export default class BootScene extends Phaser.Scene {
    /*
    This scene runs first!
    */
    constructor() {
        super({key: 'BootScene'});
        // console.log('Bootscene: constructor');
        this.managersLoaded = false;
    }

    preload() {
        this.load
            .json('allScenesData', 'assets/data/JSONs/Scenes.json');

        // this.fontStyles = new FontStyles(this);
        // this.fontStyles.load();

        //Preload and cache JSON data files
        // this.load.json('allScenesData', 'assets/data/JSONs/Scenes.json');
        this.load.json('allDialogueData', './assets/data/JSONs/Dialogue.json');
        this.load.json('allBiomesData', './assets/data/JSONs/Biomes.json');
        this.load.json('allResourcesData', './assets/data/JSONs/Resources.json');
        this.load.json('allTraditionalActivitiesData', './assets/data/JSONs/tempTraditionalActivities.json');
        this.load.json('allVocabularyMinigameData', './assets/data/JSONs/VocabMinigames.json');
        this.load.json('playerData', './assets/data/JSONs/PlayerData.json'); // Load player data for testing
        this.load.json('allVocabularyData', './assets/data/JSONs/Vocabulary.json');
        
    }

    create() {

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
        this.loadDialogueManager();

        // const fontStyles = new FontStyles();
        // fontStyles.setupGlobalFontStyles(this.game)

        this.managersLoaded = true;

        
        this.game.sceneManager.changeScene('StartMenuScene')
        //Initialize UIManager and register scenes

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
        // console.log(this.game.playerDataManager.getSettings());
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
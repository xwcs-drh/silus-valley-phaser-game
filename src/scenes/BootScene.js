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
        console.log('Bootscene: constructor');
    }

    preload() {
        console.log('Bootscene: preload');
        //Preload and cache JSON data files
        this.load.json('allScenesData', './assets/data/JSONs/Scenes.json');
        this.load.json('allDialogueData', './assets/data/JSONs/Dialogue.json');
        this.load.json('allBiomesData', './assets/data/JSONs/Biomes.json');
        this.load.json('allResourcesData', './assets/data/JSONs/Resources.json');
        this.load.json('allTraditionalActivitiesData', './assets/data/JSONs/tempTraditionalActivities.json');
        this.load.json('playerData', './assets/data/JSONs/PlayerData.json'); // Load player data for testing
    }

    create() {
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

        //Start the Main User scene - contains "Start" button, and "Credits", "Manual", "Settings" buttons.
        this.game.sceneManager.changeScene('StartMenuScene');
        // this.game.scene.launch("MainUIScene");
        //Initialize UIManager and register scenes
        // this.initializeUI();
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

    /*
    Initialize UIManager and register associated UI scenes
    Associated scenes:
        MainUIScene
        InventoryPopupScene
        RecipeBookPopupScene
    */
    // initializeUI() {
    //     // Initialize UI Manager
    //     this.game.UIManager = new UIManager(this.game);

    //     // Register and launch UI scenes
    //     this.game.UIManager.registerAndLaunchUIScenes(UIScenes);
    // }

    loadDialogueManager(){
        this.game.dialogueManager = new DialogueManager(this.game, this.game.dataManager);
    }

    /*
    Declare Scene data object - contains objects for each scene/variations of scenes determined to exist. 
    Manager: Yes, there is a DialogueManager that will be used to manage this dialogue data
    Contains:
        - "constructor_identifier": corresponds to the scene name
        - "reference_name": secondary identifier for the scene, when the scene content loads dynamically
        - "description": brief explanation of the scene
        - "background_image": filename of the background image including extension
        - "UIMenu": The name of the UIScene that should be running in parallel
        - "unlockedTraditionalActivities": reference ids for the traditional activities that are available within that scene, that the player has access to
    
    Also loads Biome Data... may have to reorganize this.
     Biomes contain:
        - "id": reference to the biome (ie. "b1")
        - "nameE": English name of the biome, used for things like variable dialogue and header text
        - "nameH": Hən̓q̓əmin̓əm̓ name of the biome, used for things like variable dialogue and header text
        - "unlocked": Does the player have access to the biome - used in UI menu, to know whether to present the biome in the navigation
        - "scene_constructor_identifier": corresponds to the scene "constructor_identifier" (ie. "BiomeHomeScene")
        - "biome_reference_name": label for the scene that will be used as a secondary scene identifier for dynamic loading (ie. "littleForest")
        - "icon_filename": filename of the biome icon image including extension
        - "description": brief explanation of the biome
        - "traditionalActivities": reference ids for the traditional activities that are available within that biome, that the player has access to
    */
    // loadSceneData(){
    //     //console.log('Bootscene: load scene data');
    //     this.game.global.allScenesData = this.cache.json.get('allScenesData');
        
    //     // Initialize the SceneManager with the data
    //     this.game.sceneManager = new SceneManager(this.game, this.game.global.allScenesData);

    //     //console.log('Bootscene: AllSceneData: ', this.game.sceneManager);
    //     this.game.global.allBiomesData = this.cache.json.get('allBiomesData');
    //     //console.log("BootScene- biomes data: ", this.game.global.allBiomesData);
    // }

    /*
    Declare Dialogue data object - contains objects for each scene, with objects for each line of dialogue in that scene
    Manager: Yes, there is a DialogueManager that will be used to manage this dialogue data
    Contains:
        - "sceneConstructor_identifier": matches "constructor_identifier" in `SceneData`
        - "dialogues": [
            - "order": the order in which this dialogueLine object will be presented
            - "textE": line of dialogue in English
            - "textH": line of dialogue in Hən̓q̓əmin̓əm̓
        - "conditions": anything that will have to be true in order for the dialogue to run, ie. has the player seen it before
        - "function":{ ... some action that must be called in relation to this line of dialogue
            - "sequence": ... does the function run before, during, or after the dialogue appears
            - "functionReference": name of the function that will be run
    */
    // loadDialogueData(){
    //     //console.log('Bootscene: load dialogue data');
    //     //load data from json cache/preload
    //     //store game in global registry
    //     /*about registry: acts as a global state manager across different scenes in a game. 
    //     It provides a convenient way to store and retrieve data that needs to be accessible across multiple scenes without directly coupling those scenes together. 
    //     This feature is particularly useful for sharing configuration settings, player scores, user preferences, 
    //     or any other form of data that needs to persist as the player navigates through various parts of the game.
    //     */
    //     const allDialogueData = this.cache.json.get('allDialogueData');
    //     this.registry.set('allDialogueData', allDialogueData);
    //     //console.log("BootScene: Loaded Dialogue Data: ", allDialogueData); // Debugging output    
    // }

    /*
    Declare traditional activity object data - contains objects for each traditional activity
    Manager: maybe?
    Contains:
        - "id": reference to the traditional activity (ie. "ta1")
        - "nickname": descriptive nickname (no spaces) of the traditional activity
        - "nameE": English title of the traditional activity
        - "nameH": Hən̓q̓əmin̓əm̓ title of the traditional activity
        - "description": brief explanation of the traditional activity. this may be displayed in the recipe book... tbd
        - "content": ... not sure what this is for. maybe additional items hat need to be displayed in the scene? i think this needs to be worked out more. it might be an array of objects that need to go into the scene with position etc
        - "vocabulary": filename of the biome icon image including extension
        - "biome": reference to the biome the traditional activity can be played/presented within 
        - "requiredResources": {traditional activity reference id: quantity of the resource needed for the traditional activity}
        - "awardedResources": {traditional activity reference id: quantity of the resource needed for the traditional activity}
        - "thumbnailFilename": filename of the traditional activity icon image including extension
        - "instructionsE": array of English instruction statements, like dialogue,... perhaps exactly like dialogue, we'll see.
        - "instructionsH": array of Hən̓q̓əmin̓əm̓ instruction statements, like dialogue,... perhaps exactly like dialogue, we'll see.
    */
    // loadTraditionalActivitiesData(){
    //     //console.log('Bootscene: load traditional activity data');
    //     this.game.global.allTraditionalActivities = this.cache.json.get('allTraditionalActivitiesData');
    // }
}
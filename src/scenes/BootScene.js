import Phaser from 'phaser';
import PlayerData from '../managers/PlayerData';
import SceneManager from '../managers/SceneManager';

export default class BootScene extends Phaser.Scene {
    /*
    This scene runs first!
    */
    constructor() {
        super({key: 'BootScene'});
        this.playerData = null;
        // console.log('Bootscene: constructor');
    }

    preload() {
        // console.log('Bootscene: preload');
        //Preload and cache JSON data files
        this.load.json('allScenesData', './assets/data/JSONs/Scenes.json');
        this.load.json('allDialogueData', './assets/data/JSONs/Dialogue.json');
        this.load.json('allBiomesData', './assets/data/JSONs/Biomes.json');
        this.load.json('allResourcesData', './assets/data/JSONs/Resources.json');
        this.load.json('allPlayerData', './assets/data/JSONs/PlayerData.json');
        this.load.json('allTraditionalActivitiesData', './assets/data/JSONs/TraditionalActivities.json');
    }

    create() {
        // console.log('boot scene: create');
        // Initialize global state
        this.game.global = {
            currentBiome: "none",
            allScenesData: [],
            allDialogueData: [],
            allBiomesData: [],
            allResources: [],
            allTraditionalActivities: [],
            allPlayerData: null, 
            playerInventory: [], 
            unlockedTraditionalActivities: [],          
            settings: {},
            userLang: "textE"
        };

        // Call load game data
        try {
          if (this.game) {
            this.loadGlobalData();
            // Once data is loaded, move to the start scene with the start menu, passing in scene data
          } else {
            console.error('Game object is not available');
          }
        } catch (error) {
          console.error('Error in BootScene create:', error);
        }

        //Start the Main User scene - contains "Start" button, and "Credits", "Manual", "Settings" buttons.
        this.scene.start('StartMenuScene', { allScenesData: this.game.global.allScenesData});
    }

    /*
    Load each major data item that will be used globally. Most will be used within respective Managers
    */
    loadGlobalData(){
        // console.log('Bootscene: load global data');
        this.game.global.playerData = ""; //will deal with this later.
        this.loadResourcesData(); //Objects associated with items that the player will collect/use
        this.loadPlayerData(); //data associated with the player's game play
        this.loadSceneData(); //data associated with scenes and scene variations
        this.loadDialogueData(); //data associated with dialogue that will appear throughout the game
        this.loadTraditionalActivitiesData(); //data associated with the traditional activities that the player will do throughout the game
    }

    /*
    Declare resource data object - contains objects for each possible resource in the game
    Contains:
        - "id": reference to the resource (ie. "r1")
        - "nameE": English name of the resource
        - "nameH": Hən̓q̓əmin̓əm̓ name of the resource,
        - "vocabID": corresponding identifier of vocab, if resource will be used in vocab games
        - "quantity": the number that the player has,... this may be removed if PlayerData gets properly implemented
        - "descriptionE": brief explanation of the scene in English
        - "descriptionH": brief explanation of the Hən̓q̓əmin̓əm̓
        - "traditionalActivitiesProvide": {traditional activity reference id: quantity of the resource needed for the traditional activity}
        - "traditionalActivitiesRequire": {traditional activity reference id: quantity of the resource awarded at completion of the traditional activity}
        - "audioFilename": name of the audio file associated with the resource, with file extension,
        - "imageFilename": name of the image file associated with the resource, with file extension,
    */
    loadResourcesData() {
        //console.log('Bootscene: load resources data');
        let allResources = this.cache.json.get('allResourcesData');
    }

    //Declare PlayerData object - contains variables related to a specific player's status
    //I need to work this out more. its not being used ATM
    loadPlayerData() {
        //console.log('BootScene: load player data');
        this.playerData = new PlayerData(this);

        // Log player inventory
        this.playerData.inventoryManager.on('inventoryLoaded', inventory => {
          //console.log('Inventory loaded:', inventory);
        });

        // Test adding an item to the inventory
        // this.playerData.inventoryManager.addItem('item1', 10);
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
    loadSceneData(){
        //console.log('Bootscene: load scene data');
        this.game.global.allScenesData = this.cache.json.get('allScenesData');
        
        // Initialize the SceneManager with the data
        this.game.sceneManager = new SceneManager(this.game, this.game.global.allScenesData);

        //console.log('Bootscene: AllSceneData: ', this.game.sceneManager);
        this.game.global.allBiomesData = this.cache.json.get('allBiomesData');
        //console.log("BootScene- biomes data: ", this.game.global.allBiomesData);
    }

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
    loadDialogueData(){
        //console.log('Bootscene: load dialogue data');
        //load data from json cache/preload
        //store game in global registry
        /*about registry: acts as a global state manager across different scenes in a game. 
        It provides a convenient way to store and retrieve data that needs to be accessible across multiple scenes without directly coupling those scenes together. 
        This feature is particularly useful for sharing configuration settings, player scores, user preferences, 
        or any other form of data that needs to persist as the player navigates through various parts of the game.
        */
        const allDialogueData = this.cache.json.get('allDialogueData');
        this.registry.set('allDialogueData', allDialogueData);
        //console.log("BootScene: Loaded Dialogue Data: ", allDialogueData); // Debugging output    
    }

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
    loadTraditionalActivitiesData(){
        //console.log('Bootscene: load traditional activity data');
        this.game.global.allTraditionalActivities = this.cache.json.get('allTraditionalActivitiesData');
    }
}
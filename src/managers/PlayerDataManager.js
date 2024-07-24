import Phaser from 'phaser';

export default class PlayerDataManager extends Phaser.Events.EventEmitter {
    //follows structure of PlayerData.json
    constructor(dataManager) {
        super();
        this.dataManager = dataManager; // Reference to DataManager to access global data
//
        this.playerData = null;
        // {
        //     username: '',
        //     settings: {
        //         language: 'E',
        //         audio: true,
        //         showDialogue: true
        //     },
        //     inventory: {
        //         "r1": 0,
        //         "r2": 0
        //     },
        //     biomesUnlocked: [],
        //     unlockedTraditionalActivities: [],
        //     progress: {
        //         completedVocabGames: [],
        //         completedTraditionalActivities: []
        //     },
        //     vocabEncounters: []
        // };
    }

    /*
    Loads cached PlayerData from BootScene.js
    currently loading from './assets/data/JSONs/PlayerData.json' for testing purposes
    
    Parameters:
      - data (object): cached file with player data. Follows structure of constructor
    */
    loadPlayerData(data) {
        this.playerData = data[0];
        console.log("playerData manager - player data: ", this.playerData);
        console.log(this.playerData.settings.language);
    }

    /*
    Saves player data to local file, local storage, or send to a server
    Set to local file for testing purposes
    */
    savePlayerData() {
      localStorage.setItem('playerData', JSON.stringify(this.playerData));
      console.log('Player data saved to localStorage');
    }

    updateSettings(newSettings) {
        this.playerData.settings = { ...this.playerData.settings, ...newSettings };
        this.savePlayerData();
    }

    updateUserLanguage(language){
      this.playerData.settings.language = language;
      console.log(this.playerData.settings.language);
      this.savePlayerData();

      //Emit an event to notify other parts of the game that the language has been updated
      this.emit("languageUpdated", language);
    }

    updateInventory(newInventory) {
        this.playerData.inventory = { ...this.playerData.inventory, ...newInventory };
        this.savePlayerData();
    }

    updateBiomes(newBiomes) {
        this.playerData.biomes = newBiomes;
        this.savePlayerData();
    }

    updateUnlockedTraditionalActivities(newActivities) {
        this.playerData.unlockedTraditionalActivities = newActivities;
        this.savePlayerData();
    }

    updateProgress(newProgress) {
        this.playerData.progress = { ...this.playerData.progress, ...newProgress };
        this.savePlayerData();
    }

    updateVocabEncounters(newEncounters) {
        this.playerData.vocabEncounters = newEncounters;
        this.savePlayerData();
    }

    //Access all data for current player
    getPlayerData() {
        console.log("playerData manager - player data: ", this.playerData);
        return this.playerData;
    }

    //Access all settings set by current player
    getSettings() {
        console.log("playerData manager - player data settings: ", this.playerData.settings);
        return this.playerData.settings;
    }

    /*Access the language that the user has decided to display text in.
      Note: some text is forced to be displayed in one language or the other.
    Returns e.g.
    `E` or `H`

    Will be concatenated with `name` or `description` based on text type indicated in json data.
    */
    getUserLanguage(){
      // console.log("getting user language", this.playerData.settings.language);
      return this.playerData.settings.language;
      // return "E";
    }

    /*
    Access inventory:
    Provides information on the resources and quantities that the player has acquired
    Returns e.g.: 
     `["r1": 0, "r2": 0]`
    */
    getInventory() {
        return this.playerData.inventory;
    }

    /*Access the list of keys of the biomes that the player has unlocked
    Returns e.g.: 
      `["b1", "b2"]`
    */
    getBiomes() {
        return this.playerData.biomesUnlocked;
    }

    /*Access the list of keys of the traditional activities that the player has unlocked
    Returns e.g.: 
      `["ta1", "ta2"]`
    */
    getUnlockedTraditionalActivities() {
        return this.playerData.unlockedTraditionalActivities;
    }

    /*
    This data needs to be worked out more and will probably be separated
    Returns e.g.
      `"completedVocabGames": ["game1", "game2"],
        "completedTraditionalActivities": ["activity1"]`
    */
    getProgress() {
        return this.playerData.progress;
    }

    /*
    Gets an array of objects of the vocab the players has encountered, 
      including the vocabID, times encountered, and the times they've correctly identified the vocabulary item.
    Returns e.g.
    ` [{
      "vocabId": "v2",
      "timesEncountered": 1,
      "timesCorrect": 0
    },
    {
      "vocabId": "v1",
      "timesEncountered": 1,
      "timesCorrect": 1
    }]`
    */
    getVocabEncounters() {
        return this.playerData.vocabEncounters;
    }

    /* 
    Check if the player has enough resources for a traditional activity
    Parameters:
      - activityID (string): corresponds to traditionalActivity[id]   
    */
    hasRequiredResourcesForActivity(activityId) {
        const activity = this.dataManager.getTraditionalActivity(activityId);
        if (!activity) return false;

        for (const resourceId in activity.requiredResources) {
            if (this.playerData.inventory[resourceId] < activity.requiredResources[resourceId]) {
                return false;
            }
        }
        return true;
    }

    /*
    Update player's inventory after completing a traditional activity
    Parameters:
      - activity ID (string): corresponds to traditionalActivity[id]
    */
    completeTraditionalActivity(activityId) {
        const activity = this.dataManager.getTraditionalActivity(activityId);
        if (!activity) return;

        for (const resourceId in activity.requiredResources) {
            this.playerData.inventory[resourceId] -= activity.requiredResources[resourceId];
        }
        for (const resourceId in activity.awardedResources) {
            this.playerData.inventory[resourceId] = (this.playerData.inventory[resourceId] || 0) + activity.awardedResources[resourceId];
        }

        if (!this.playerData.progress.completedTraditionalActivities.includes(activityId)) {
            this.playerData.progress.completedTraditionalActivities.push(activityId);
        }

        this.savePlayerData();
    }

    /*
    Used in DataManager or InventoryPopupScene
      to check if a resourceCard should be greyed out in the inventory popup
    Used in DataManager or TraditionalActivityPopupScene to see if a player has enough of a resource in their inventory to play an activity
    */
    isResourceAvailable(resourceId) {
        const resource = this.dataManager.getResource(resourceId); // get resource object
        if (!resource) return false; //return false if resource is null

        //check if any of the player's unlocked activities award this resource
        for (const activityId of this.playerData.unlockedTraditionalActivities) {
          console.log("PlayerDataManager - isResourceAvailalble resourceID: ",activityId);
            const activity = this.dataManager.getTraditionalActivity(activityId);
            if (activity.activityUnlocked && activity.awardedResources[resourceId]) {
              console.log("PlayerDataManager - isActivityUnlocked: ",activity.activityUnlocked, "awards: ", activity.awardedResources[resourceId]);
              return true;
            }
        }
        return false;
    }

    removeResource(resourceId, quantity) {
        this.playerData.inventory[resourceId] -= quantity;
        // this.savePlayerData();
    }
}
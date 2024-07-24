export default class DataManager {
    constructor() {
        this.data = {
            currentBiome: null,
            allBiomesData: [],
            allResourcesData: [],
            allTraditionalActivitiesData: [],
            allScenesData: [],
            allDialogueData:[],
            currentSceneData: null
        };
    }

    setAllBiomesData(biomesData) {
        this.data.allBiomesData = biomesData;
    }

    getAllBiomesData() {
        return this.data.allBiomesData;
    }

    setCurrentBiome(biomeReference) {
        this.currentBiome = this.data.allBiomesData.find(b => b.biome_reference_name === biomeReference);
        console.log("Data Manager - current biome set: ", this.currentBiome);
    }
   
    getCurrentBiome() {
        console.log("Data Manager - Current Biome: ", this.currentBiome);
        return this.currentBiome;
    }

    getCurrentBiomeID(){
        return this.currentBiome.id;
    }

    getNumberUnlockedBiomes(){
        // Filter the biomes where unlocked is true
        const unlockedBiomes = this.data.allBiomesData.filter(biome => biome.unlocked === "true");

        // Get the count of unlocked biomes
        const unlockedBiomesCount = unlockedBiomes.length;

        console.log('Data Manager - Number of unlocked biomes:', unlockedBiomesCount);
        
        return unlockedBiomesCount;
    }



    getCurrentBiomeReference(){
        console.log(this.currentBiome);
        if(this.currentBiome !=null){
            return this.currentBiome.biome_reference_name;
        } 
        return null;
    }

    getBiomeFromID(biomeID){
        const biome = this.data.allBiomesData.find(b => b.id === biomeID);
        return biome;
    }
    /*
    Set resource data object - contains objects for each possible resource in the game
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
    setAllResourcesData(resources) {
        this.data.allResources = resources;
    }

    getAllResources() {
        console.log('Data Manager - All Resources length:', this.data.allResources.length);
        return this.data.allResources;
    }

    getResource(resourceID){
        const resource = this.data.allResources.find(r => r.id === resourceID);
        return resource;
    }

    setAllTraditionalActivitiesData(activities) {
        this.data.allTraditionalActivitiesData = activities;
    }

    getAllTraditionalActivities() {
        return this.data.allTraditionalActivitiesData;
    }

    setAllDialogueData(dialogue){
        this.data.allDialogueData = dialogue;
    }

    getAllDialogueData() {
        return this.data.allDialogueData;
    }

    setAllScenesData(scenesData) {
        this.data.allScenesData = scenesData;
    }

    getAllScenesData() {
        console.log("Data Manager - All Scenes Data: ", this.data.allScenesData);
        return this.data.allScenesData;
    }

    setCurrentSceneData(newSceneKey, newReference = null){
        console.log(newSceneKey);
        const allScenesData = this.getAllScenesData();
        console.log(allScenesData);
        let sceneData = null;
        if(!newReference){
            console.log("Data Manager no new reference... sceneKey: ", newSceneKey);
            sceneData = allScenesData.find(scene => scene.constructor_identifier === newSceneKey);
            console.log("found from scene key", sceneData);
        }        
        else if (newReference && !sceneData) {
            console.log("Data Manager new reference: ", newReference);
            sceneData = allScenesData.find(scene => scene.reference_name === newReference);
        }
        else{console.log("Data Manager current scene data set to: ", sceneData);}
        console.log(sceneData);
        this.currentSceneData = sceneData;
    }

    getCurrentSceneData(){
        return this.currentSceneData;
    }

    getTraditionalActivity(activityID){
        const activities = this.getAllTraditionalActivities();
        
        const activity = activities.find(activity => activity.id === activityID);
        console.log("DataManager - TraditionalActivity: ", activity);
        if(!activity){
            return null;
        }

        return activity;
    }

    getActivitiesForBiome(biomeID) {
        const activities = this.getAllTraditionalActivities();
        // Assuming activities is a global array containing all activities
        return activities.filter(activity => activity.biome === biomeID);
    }

    unlockTraditionalActivities() {
        const inventory = this.game.playerDataManager.getPlayerData().inventory;
        const unlockedActivities = [];

        this.data.allTraditionalActivitiesData.forEach(activity => {
            if (activity.unlocked === "false") {
                const requiredResources = activity.traditionalActivitiesRequire;
                const hasAllResources = Object.keys(requiredResources).every(resourceID => {
                    const requiredQuantity = requiredResources[resourceID];
                    const playerResource = inventory.find(r => r.id === resourceID);
                    return playerResource && playerResource.quantity >= requiredQuantity;
                });

                if (hasAllResources) {
                    activity.unlocked = "true";
                    unlockedActivities.push(activity);
                }
            }
        });

        console.log(unlockedActivities);
        return unlockedActivities.length > 0 ? unlockedActivities : null;
    }

}